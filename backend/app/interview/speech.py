from fastapi import APIRouter, UploadFile, File
import whisper
import tempfile
import os

router = APIRouter()

model = whisper.load_model("base")

@router.post("/transcribe", include_in_schema=False)
async def transcribe_audio(audio: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".webm") as temp:
        temp.write(await audio.read())
        temp_path = temp.name

    result = model.transcribe(temp_path)
    os.remove(temp_path)

    return {"text": result["text"]}
