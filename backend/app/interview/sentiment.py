from fastapi import APIRouter
from pydantic import BaseModel
from transformers import pipeline

router = APIRouter()

# Load sentiment model once (efficient)
sentiment_analyzer = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english"
)

class TextInput(BaseModel):
    text: str

@router.post("/sentiment")
def analyze_sentiment(data: TextInput):
    # Handle empty / silent answers
    if not data.text or not data.text.strip():
        return {
            "label": "NEUTRAL",
            "score": 0.0
        }

    result = sentiment_analyzer(data.text)[0]

    # Convert score to percentage for frontend
    score_percent = round(result["score"] * 100, 2)

    return {
        "label": result["label"],
        "score": score_percent
    }
