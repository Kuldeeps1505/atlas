const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Placeholder for database connections
// const { Client } = require('pg');
// const { MongoClient } = require('mongodb');

// For MVP, use in-memory storage
let analyses = [];

app.post('/api/analyze-product', async (req, res) => {
  try {
    const { productText } = req.body;
    // Call FastAPI agent pipeline
    const response = await axios.post('http://localhost:8000/run-agents', { productText });
    const result = response.data;
    // Store results in database (placeholder)
    analyses.push({ id: Date.now(), ...result });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/history', (req, res) => {
  res.json(analyses);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Node API Gateway running on port ${PORT}`);
});