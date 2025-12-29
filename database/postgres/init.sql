-- PostgreSQL initialization script for Atlas Product Intelligence Agent

-- Create database if not exists (handled by POSTGRES_DB env var)
-- This script runs after the database is created

-- Create a sample table for products
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on category for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create a sample table for user interactions
CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    product_id INTEGER REFERENCES products(id),
    interaction_type VARCHAR(50), -- 'view', 'click', 'purchase', etc.
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO products (name, description, price, category) VALUES
('Sample Product 1', 'This is a sample product for testing', 29.99, 'Electronics'),
('Sample Product 2', 'Another sample product', 49.99, 'Books')
ON CONFLICT DO NOTHING;