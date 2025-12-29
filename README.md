# ATLAS - Agentic GenAI Product Intelligence Assistant

A production-ready MVP for analyzing product data using multi-agent GenAI system.

## Architecture

- **Frontend**: Next.js (React, App Router) - User interface for input and results display
- **API Gateway**: Node.js + Express - Orchestrates requests and handles data storage
- **GenAI Service**: FastAPI (Python) - Multi-agent system for product analysis
- **Databases**:
  - PostgreSQL: Structured data (products, insights, logs)
  - MongoDB: Unstructured data (raw reviews, agent outputs)

## Multi-Agent System

1. **Summarization Agent**: Extracts key features, positives, negatives, sentiment
2. **Insight Extraction Agent**: Identifies pain points, trends, strengths/weaknesses with confidence scores
3. **Decision Support Agent**: Provides actionable recommendations with reasoning
4. **Orchestrator Agent**: Controls execution flow and data passing

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
Create `.env` files:

**backend/node/.env**
```
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/atlas
MONGODB_URI=mongodb://localhost:27017/atlas
```

**backend/python/.env**
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Start Databases
```bash
docker-compose up -d
```

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