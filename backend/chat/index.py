import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event, context):
    '''
    Система чатов между покупателями и продавцами для обсуждения сделок
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        room_id = params.get('room_id')
        user_id = params.get('user_id')
        
        if room_id:
            cur.execute(
                """SELECT m.*, u.username as sender_name 
                FROM messages m 
                JOIN users u ON m.sender_id = u.id 
                WHERE m.room_id = %s 
                ORDER BY m.created_at ASC""",
                (room_id,)
            )
            messages = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(m) for m in messages], default=str),
                'isBase64Encoded': False
            }
        
        if user_id:
            cur.execute(
                """SELECT cr.*, 
                    l.title as listing_title,
                    u1.username as buyer_name,
                    u2.username as seller_name,
                    (SELECT COUNT(*) FROM messages WHERE room_id = cr.id AND is_read = false AND sender_id != %s) as unread_count
                FROM chat_rooms cr
                JOIN listings l ON cr.listing_id = l.id
                JOIN users u1 ON cr.buyer_id = u1.id
                JOIN users u2 ON cr.seller_id = u2.id
                WHERE cr.buyer_id = %s OR cr.seller_id = %s
                ORDER BY cr.created_at DESC""",
                (user_id, user_id, user_id)
            )
            rooms = cur.fetchall()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps([dict(r) for r in rooms], default=str),
                'isBase64Encoded': False
            }
        
        cur.close()
        conn.close()
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'room_id or user_id required'}),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'send_message':
            room_id = body.get('room_id')
            sender_id = body.get('sender_id')
            message = body.get('message')
            
            if not room_id or not sender_id or not message:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'room_id, sender_id and message required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO messages (room_id, sender_id, message) 
                VALUES (%s, %s, %s) 
                RETURNING id, room_id, sender_id, message, created_at""",
                (room_id, sender_id, message)
            )
            new_message = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_message), default=str),
                'isBase64Encoded': False
            }
        
        if action == 'mark_read':
            room_id = body.get('room_id')
            user_id = body.get('user_id')
            
            if not room_id or not user_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'room_id and user_id required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE messages SET is_read = true WHERE room_id = %s AND sender_id != %s",
                (room_id, user_id)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'ok'}),
                'isBase64Encoded': False
            }
    
    cur.close()
    conn.close()
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
