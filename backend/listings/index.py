import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event, context):
    '''
    Управление товарами: создание, поиск, покупка товаров на маркетплейсе
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
        listing_id = params.get('id')
        
        if listing_id:
            cur.execute(
                """SELECT l.*, u.username as seller_name, u.rating as seller_rating 
                FROM listings l 
                JOIN users u ON l.user_id = u.id 
                WHERE l.id = %s""",
                (listing_id,)
            )
            listing = cur.fetchone()
            cur.close()
            conn.close()
            
            if not listing:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Listing not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(listing), default=str),
                'isBase64Encoded': False
            }
        
        query = """SELECT l.*, u.username as seller_name, u.rating as seller_rating 
                   FROM listings l 
                   JOIN users u ON l.user_id = u.id 
                   WHERE l.is_sold = false"""
        
        query_params = []
        
        if params.get('game') and params['game'] != 'all':
            query += " AND l.game = %s"
            query_params.append(params['game'])
        
        if params.get('category') and params['category'] != 'all':
            query += " AND l.category = %s"
            query_params.append(params['category'])
        
        if params.get('search'):
            query += " AND (l.title ILIKE %s OR l.description ILIKE %s)"
            search_term = f"%{params['search']}%"
            query_params.extend([search_term, search_term])
        
        query += " ORDER BY l.is_premium DESC, l.created_at DESC LIMIT 100"
        
        cur.execute(query, tuple(query_params))
        listings = cur.fetchall()
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps([dict(l) for l in listings], default=str),
            'isBase64Encoded': False
        }
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'create':
            required_fields = ['user_id', 'title', 'price', 'game', 'item_type', 'category']
            if not all(body.get(field) for field in required_fields):
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """INSERT INTO listings (user_id, title, description, price, game, item_type, category, is_premium) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s) 
                RETURNING id, user_id, title, price, game, item_type, category, is_premium, created_at""",
                (body['user_id'], body['title'], body.get('description', ''), body['price'], 
                 body['game'], body['item_type'], body['category'], body.get('is_premium', False))
            )
            new_listing = cur.fetchone()
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(new_listing), default=str),
                'isBase64Encoded': False
            }
        
        if action == 'buy':
            buyer_id = body.get('buyer_id')
            listing_id = body.get('listing_id')
            
            if not buyer_id or not listing_id:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'buyer_id and listing_id required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT * FROM listings WHERE id = %s AND is_sold = false", (listing_id,))
            listing = cur.fetchone()
            
            if not listing:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Listing not found or already sold'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT balance FROM users WHERE id = %s", (buyer_id,))
            buyer = cur.fetchone()
            
            if not buyer or buyer['balance'] < listing['price']:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient balance'}),
                    'isBase64Encoded': False
                }
            
            commission = float(listing['price']) * 0.12
            seller_amount = float(listing['price']) - commission
            
            cur.execute("UPDATE users SET balance = balance - %s WHERE id = %s", (listing['price'], buyer_id))
            cur.execute("UPDATE users SET balance = balance + %s, total_sales = total_sales + 1 WHERE id = %s", 
                       (seller_amount, listing['user_id']))
            cur.execute("UPDATE listings SET is_sold = true WHERE id = %s", (listing_id,))
            
            cur.execute(
                """INSERT INTO purchases (buyer_id, seller_id, listing_id, amount, commission) 
                VALUES (%s, %s, %s, %s, %s) RETURNING id""",
                (buyer_id, listing['user_id'], listing_id, listing['price'], commission)
            )
            purchase = cur.fetchone()
            
            cur.execute(
                """INSERT INTO chat_rooms (buyer_id, seller_id, listing_id) 
                VALUES (%s, %s, %s) ON CONFLICT DO NOTHING RETURNING id""",
                (buyer_id, listing['user_id'], listing_id)
            )
            room = cur.fetchone()
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'purchase_id': purchase['id'],
                    'chat_room_id': room['id'] if room else None,
                    'message': 'Purchase successful'
                }),
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
