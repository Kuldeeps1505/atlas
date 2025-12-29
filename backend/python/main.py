from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
import psycopg2
from pymongo import MongoClient
from datetime import datetime

load_dotenv()
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))

app = FastAPI()

# Database connections
pg_conn = None
mongo_client = None
mongo_db = None

def init_databases():
    global pg_conn, mongo_client, mongo_db
    try:
        # PostgreSQL connection
        pg_conn = psycopg2.connect(
            host=os.getenv('POSTGRES_HOST', 'localhost'),
            port=os.getenv('POSTGRES_PORT', 5432),
            database=os.getenv('POSTGRES_DB', 'atlas'),
            user=os.getenv('POSTGRES_USER', 'user'),
            password=os.getenv('POSTGRES_PASSWORD', 'password')
        )
        print("Connected to PostgreSQL")

        # MongoDB connection
        mongo_client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017'))
        mongo_db = mongo_client['atlas']
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Database connection error: {e}")

# Initialize databases on startup
init_databases()

class ProductText(BaseModel):
    productText: str

class SummarizationAgent:
    def run(self, text: str):
        prompt = f"""
        You are a summarization agent. Analyze the following product text (reviews, descriptions, feedback) and provide a concise summary.

        Output ONLY valid JSON in this format:
        {{
            "key_features": ["list of key features"],
            "main_positives": ["list of main positives"],
            "main_negatives": ["list of main negatives"],
            "customer_sentiment_overview": "overall sentiment summary"
        }}

        Remove noise and repetition.

        Product text: {text}
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        # Clean response to get JSON
        text_response = response.text.strip()
        if text_response.startswith('```json'):
            text_response = text_response[7:-3].strip()
        return json.loads(text_response)

class InsightExtractionAgent:
    def run(self, summary: dict):
        prompt = f"""
        You are an insight extraction agent. Based on the summarized data, extract insights.

        Detect recurring pain points, identify trends and anomalies, strength vs weakness analysis.

        Output ONLY valid JSON array in this format:
        [
            {{
                "insight": "description",
                "type": "pain_point|trend|anomaly|strength|weakness",
                "confidence": 0.8
            }}
        ]

        Summary: {json.dumps(summary)}
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        if text_response.startswith('```json'):
            text_response = text_response[7:-3].strip()
        return json.loads(text_response)

class DecisionSupportAgent:
    def run(self, insights: list):
        prompt = f"""
        You are a decision support agent. Based on extracted insights, provide recommendations for product improvement.

        Each decision must include recommendation, reasoning, triggering insights.

        Output ONLY valid JSON array in this format:
        [
            {{
                "recommendation": "specific suggestion",
                "reasoning": "why this recommendation",
                "triggering_insights": ["insight1", "insight2"]
            }}
        ]

        Insights: {json.dumps(insights)}
        """
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        text_response = response.text.strip()
        if text_response.startswith('```json'):
            text_response = text_response[7:-3].strip()
        return json.loads(text_response)

class OrchestratorAgent:
    def __init__(self):
        self.summarizer = SummarizationAgent()
        self.insight_extractor = InsightExtractionAgent()
        self.decision_supporter = DecisionSupportAgent()

    def run_pipeline(self, text: str):
        summary = self.summarizer.run(text)
        insights = self.insight_extractor.run(summary)
        decisions = self.decision_supporter.run(insights)
        return {
            "summary": summary,
            "insights": insights,
            "decisions": decisions
        }

orchestrator = OrchestratorAgent()

@app.post("/run-agents")
async def run_agents(product: ProductText):
    try:
        result = orchestrator.run_pipeline(product.productText)

        # Store in PostgreSQL
        if pg_conn:
            with pg_conn.cursor() as cursor:
                cursor.execute(
                    "INSERT INTO user_interactions (user_id, interaction_type) VALUES (%s, %s) RETURNING id",
                    ('system', 'analysis')
                )
                analysis_id = cursor.fetchone()[0]
                pg_conn.commit()

                # Store detailed results in MongoDB
                if mongo_db:
                    analysis_doc = {
                        'id': analysis_id,
                        'product_text': product.productText,
                        'result': result,
                        'timestamp': datetime.utcnow()
                    }
                    mongo_db.analyses.insert_one(analysis_doc)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health():
    return {"status": "ok"}