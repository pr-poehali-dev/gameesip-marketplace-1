import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event, context):
    '''
    Управление пользователями: создание, получение данных, обновление профиля
    '''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
        user_id = params.get('id')
        
        if user_id:
            cur.execute(
                "SELECT id, username, email, balance, rating, total_sales, is_premium, premium_expires_at, created_at FROM users WHERE id = %s",
                (user_id,)
            )
            user = cur.fetchone()
            cur.close()
            conn.close()
            
            if not user:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'User not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(user), default=str),
                'isBase64Encoded': False
            }
        
        cur.execute("SELECT id, username, rating, total_sales FROM users LIMIT 100")
        users = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(u) for u in users], default=str),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        username = body.get('username')
        email = body.get('email')
        
        if not username:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'username is required'}),
                'isBase64Encoded': False
            }
        
        cur.execute(
            "INSERT INTO users (username, email) VALUES (%s, %s) RETURNING id, username, email, balance, rating, total_sales",
            (username, email)
        )
        new_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(dict(new_user), default=str),
            'isBase64Encoded': False
        }
    
    if method == 'PUT':
        body = json.loads(event.get('body', '{}'))
        user_id = body.get('id')
        
        if not user_id:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'user id is required'}),
                'isBase64Encoded': False
            }
        
        updates = []
        values = []
        
        if 'username' in body:
            updates.append('username = %s')
            values.append(body['username'])
        if 'email' in body:
            updates.append('email = %s')
            values.append(body['email'])
        if 'is_premium' in body:
            updates.append('is_premium = %s')
            values.append(body['is_premium'])
        
        if not updates:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'No fields to update'}),
                'isBase64Encoded': False
            }
        
        values.append(user_id)
        query = f"UPDATE users SET {', '.join(updates)} WHERE id = %s RETURNING id, username, email, balance, rating, total_sales, is_premium"
        
        cur.execute(query, tuple(values))
        updated_user = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps(dict(updated_user), default=str),
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
