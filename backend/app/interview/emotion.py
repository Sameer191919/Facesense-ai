from fastapi import APIRouter, UploadFile, File
from deepface import DeepFace
import tempfile
import os

router = APIRouter()

@router.post("/emotion", include_in_schema=False)
async def detect_emotion(image: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(await image.read())
        temp_path = temp.name

    try:
        result = DeepFace.analyze(
            img_path=temp_path,
            actions=["emotion"],
            enforce_detection=False
        )
        emotion = result[0]["dominant_emotion"]
    except Exception:
        emotion = "unknown"

    os.remove(temp_path)

    return {"emotion": emotion}
