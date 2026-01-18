from fastapi import APIRouter
from fastapi.responses import FileResponse
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
import tempfile
import os

router = APIRouter()

@router.post("/feedback")
def generate_feedback(data: dict):
    """
    Generates interview feedback PDF and returns it as a downloadable file
    """

    # --- Simple scoring logic ---
    emotion = data.get("emotion_summary", "neutral")
    sentiment = data.get("sentiment", "NEUTRAL")
    answers = data.get("answers_count", 0)
    candidate = data.get("candidate", "Candidate")

    emotion_score = 8 if emotion in ["happy", "neutral", "confident"] else 5
    sentiment_score = 8 if sentiment == "POSITIVE" else 5
    communication_score = (emotion_score + sentiment_score) // 2

    # --- Create PDF ---
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
    pdf_path = temp_file.name

    c = canvas.Canvas(pdf_path, pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 18)
    c.drawString(50, height - 50, "AI Mock Interview Feedback Report")

    c.setFont("Helvetica", 12)
    c.drawString(50, height - 100, f"Candidate Name: {candidate}")
    c.drawString(50, height - 130, f"Questions Answered: {answers}")

    c.drawString(50, height - 180, f"Overall Emotion: {emotion}")
    c.drawString(50, height - 210, f"Sentiment: {sentiment}")

    c.drawString(50, height - 260, f"Confidence Score: {emotion_score}/10")
    c.drawString(50, height - 290, f"Communication Score: {communication_score}/10")

    c.drawString(50, height - 340, "Final Feedback:")
    c.drawString(
        50,
        height - 370,
        "The candidate demonstrated good communication skills and emotional stability during the interview."
    )

    c.showPage()
    c.save()

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="Interview_Feedback_Report.pdf"
    )
