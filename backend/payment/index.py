import json
import os
import uuid
from yookassa import Configuration, Payment
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event, context):
    '''
    Обработка платежей через ЮKassa: пополнение баланса и вывод средств
    '''
    Configuration.account_id = os.environ.get('YOOKASSA_SHOP_ID', '')
    Configuration.secret_key = os.environ.get('YOOKASSA_SECRET_KEY', '')
    
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
    
    if method == 'POST':
        body = json.loads(event.get('body', '{}'))
        action = body.get('action')
        
        if action == 'create_deposit':
            user_id = body.get('user_id')
            amount = body.get('amount')
            
            if not user_id or not amount:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and amount required'}),
                    'isBase64Encoded': False
                }
            
            idempotence_key = str(uuid.uuid4())
            
            payment = Payment.create({
                "amount": {
                    "value": str(amount),
                    "currency": "RUB"
                },
                "confirmation": {
                    "type": "redirect",
                    "return_url": f"https://{event['requestContext']['domainName']}/profile"
                },
                "capture": True,
                "description": f"Пополнение баланса GAMEESIP",
                "metadata": {
                    "user_id": user_id,
                    "type": "deposit"
                }
            }, idempotence_key)
            
            conn = get_db_connection()
            cur = conn.cursor()
            cur.execute(
                "INSERT INTO transactions (user_id, type, amount, status, payment_id, description) VALUES (%s, %s, %s, %s, %s, %s)",
                (user_id, 'deposit', amount, 'pending', payment.id, 'Пополнение баланса')
            )
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'payment_url': payment.confirmation.confirmation_url,
                    'payment_id': payment.id
                }),
                'isBase64Encoded': False
            }
        
        if action == 'webhook':
            notification = body.get('object')
            
            if notification and notification.get('status') == 'succeeded':
                payment_id = notification.get('id')
                metadata = notification.get('metadata', {})
                user_id = metadata.get('user_id')
                amount = float(notification['amount']['value'])
                
                conn = get_db_connection()
                cur = conn.cursor()
                
                cur.execute(
                    "UPDATE transactions SET status = 'completed' WHERE payment_id = %s",
                    (payment_id,)
                )
                
                cur.execute(
                    "UPDATE users SET balance = balance + %s WHERE id = %s",
                    (amount, user_id)
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
        
        if action == 'withdraw':
            user_id = body.get('user_id')
            amount = body.get('amount')
            card_number = body.get('card_number')
            
            if not user_id or not amount or not card_number:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Missing required fields'}),
                    'isBase64Encoded': False
                }
            
            conn = get_db_connection()
            cur = conn.cursor(cursor_factory=RealDictCursor)
            cur.execute("SELECT balance FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user or user['balance'] < amount:
                cur.close()
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Insufficient balance'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                "UPDATE users SET balance = balance - %s WHERE id = %s",
                (amount, user_id)
            )
            
            cur.execute(
                "INSERT INTO transactions (user_id, type, amount, status, description) VALUES (%s, %s, %s, %s, %s)",
                (user_id, 'withdraw', amount, 'pending', f'Вывод на карту {card_number[-4:]}')
            )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'status': 'pending', 'message': 'Заявка на вывод создана'}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }