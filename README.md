# ATLAS - Agentic GenAI Product Intelligence Assistant

A production-ready MVP for analyzing product data using multi-agent GenAI system.

## Architecture

- **Frontend**: Next.js (React, App Router) - User interface for input and results display
- **API Gateway**: Node.js + Express - Orchestrates requests and handles data storage
- **GenAI Service**: FastAPI (Python) - Multi-agent system for product analysis
- **Databases**:
  - PostgreSQL: Structured data (products, insights, logs)
  - MongoDB: Unstructured data (raw reviews, agent outputs)

## Database Schema

### PostgreSQL
- **products**: Product catalog with structured data
- **user_interactions**: User interaction logs

### MongoDB Collections
- **products**: Product documents with flexible schema
- **user_interactions**: Interaction data
- **analyses**: AI analysis results
- **analytics**: Aggregated analytics data

Database initialization scripts are located in `database/` folder and run automatically when containers start.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker & Docker Compose
- Gemini API key

### 1. Clone and Setup
```bash
cd ATLAS
```

### 2. Environment Variables
Create `.env` file in root directory:

```
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=atlas
POSTGRES_USER=user
POSTGRES_PASSWORD=password

MONGODB_URI=mongodb://localhost:27017

# API Keys
GEMINI_API_KEY=your_gemini_api_key_here

# Ports
NODE_PORT=3001
PYTHON_PORT=8000
```

### 3. Start All Services with Docker
```bash
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- MongoDB database on port 27017
- Node.js API Gateway on port 3001
- Python FastAPI service on port 8000

### Alternative: Manual Setup

If you prefer manual setup instead of Docker:

### 4. Setup Python Backend
```bash
cd backend/python
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 5. Setup Node.js Backend
```bash
cd backend/node
npm install
npm run dev
```

### 6. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 7. Access Application
- Frontend: http://localhost:3000
- Node API: http://localhost:3001
- FastAPI: http://localhost:8000

## API Endpoints

### Node.js API Gateway
- `POST /api/analyze-product` - Analyze product text
- `GET /api/history` - Get analysis history
- `GET /api/health` - Health check

### FastAPI GenAI Service
- `POST /run-agents` - Run full agent pipeline
- `GET /health` - Health check

## Usage

1. Paste product reviews/descriptions/feedback in the textarea
2. Click "Analyze Product"
3. View structured summary, insights, and AI recommendations

## Features

- Explainable AI decisions grounded in data
- Multi-agent reasoning pipeline
- Modular architecture
- Production-ready error handling
- Clean separation of concerns