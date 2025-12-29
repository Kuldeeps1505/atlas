const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Client } = require('pg');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Database connections
let pgClient;
let mongoClient;
let mongoDb;

async function connectDatabases() {
  try {
    // PostgreSQL connection
    pgClient = new Client({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: process.env.POSTGRES_PORT || 5432,
      database: process.env.POSTGRES_DB || 'atlas',
      user: process.env.POSTGRES_USER || 'user',
      password: process.env.POSTGRES_PASSWORD || 'password',
    });
    await pgClient.connect();
    console.log('Connected to PostgreSQL');

    // MongoDB connection
    mongoClient = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    await mongoClient.connect();
    mongoDb = mongoClient.db('atlas');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

// Initialize database connections
connectDatabases();

app.post('/api/analyze-product', async (req, res) => {
  try {
    const { productText } = req.body;
    // Call FastAPI agent pipeline
    const response = await axios.post('http://localhost:8000/run-agents', { productText });
    const result = response.data;

    // Store results in PostgreSQL
    const query = 'INSERT INTO user_interactions (user_id, interaction_type) VALUES ($1, $2) RETURNING id';
    const values = ['system', 'analysis'];
    const pgResult = await pgClient.query(query, values);

    // Store detailed results in MongoDB
    const analysisDoc = {
      id: pgResult.rows[0].id,
      productText,
      result,
      timestamp: new Date()
    };
    await mongoDb.collection('analyses').insertOne(analysisDoc);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history', async (req, res) => {
  try {
    // Get analyses from MongoDB
    const analyses = await mongoDb.collection('analyses').find({}).sort({ timestamp: -1 }).limit(50).toArray();
    res.json(analyses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Node API Gateway running on port ${PORT}`);
});