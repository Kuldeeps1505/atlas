// MongoDB initialization script for Atlas Product Intelligence Agent

// This script runs when the MongoDB container starts
// It sets up the initial database structure and sample data

// Switch to the atlas database
db = db.getSiblingDB('atlas');

// Create collections
db.createCollection('products');
db.createCollection('user_interactions');
db.createCollection('analytics');

// Create indexes for better performance
db.products.createIndex({ "category": 1 });
db.products.createIndex({ "name": "text", "description": "text" });
db.user_interactions.createIndex({ "user_id": 1, "timestamp": -1 });
db.analytics.createIndex({ "date": 1 });

// Insert sample products
db.products.insertMany([
    {
        name: "Sample Product 1",
        description: "This is a sample product for testing purposes",
        price: 29.99,
        category: "Electronics",
        tags: ["sample", "electronics"],
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        name: "Sample Product 2",
        description: "Another sample product for demonstration",
        price: 49.99,
        category: "Books",
        tags: ["sample", "books"],
        created_at: new Date(),
        updated_at: new Date()
    }
]);

// Insert sample user interactions
db.user_interactions.insertMany([
    {
        user_id: "user123",
        product_id: ObjectId(), // Would reference actual product IDs
        interaction_type: "view",
        timestamp: new Date()
    },
    {
        user_id: "user456",
        product_id: ObjectId(),
        interaction_type: "purchase",
        timestamp: new Date()
    }
]);

// Create a sample analytics document
db.analytics.insertOne({
    date: new Date(),
    total_views: 150,
    total_purchases: 25,
    top_categories: ["Electronics", "Books"]
});

print("MongoDB initialization completed successfully");