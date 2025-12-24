CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    rating DECIMAL(3, 2) DEFAULT 0.00,
    total_sales INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT FALSE,
    premium_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    game VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_id VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    commission DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chat_rooms (
    id SERIAL PRIMARY KEY,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(buyer_id, seller_id, listing_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_listings_game ON listings(game);
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_messages_room ON messages(room_id);
CREATE INDEX idx_chat_rooms_users ON chat_rooms(buyer_id, seller_id);