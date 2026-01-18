from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.interview.speech import router as speech_router
from app.interview.feedback import router as feedback_router
from app.database import engine, Base
from app.auth.routes import router as auth_router
from app.interview.questions import router as question_router
from app.interview.speech import router as speech_router
from app.interview.emotion import router as emotion_router
from app.interview.sentiment import router as sentiment_router
from app.auth.profile import router as profile_router
from app import models
from dotenv import load_dotenv
load_dotenv()


# Create DB tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="FaceSense AI Backend")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(question_router, prefix="/api/interview", tags=["Questions"])
app.include_router(speech_router, prefix="/api/interview", tags=["Speech"])
app.include_router(emotion_router, prefix="/api/interview", tags=["Emotion"])
app.include_router(sentiment_router, prefix="/api/interview", tags=["Sentiment"])
app.include_router(profile_router)
app.include_router(
    emotion_router,
    prefix="/api/interview",
    tags=["Emotion"]
)
app.include_router(
    speech_router,
    prefix="/api/interview",
    tags=["Speech"]
)
app.include_router(
    feedback_router,
    prefix="/api/interview",
    tags=["Feedback"]
)
@app.get("/")
def root():
    return {"status": "Backend running"}
