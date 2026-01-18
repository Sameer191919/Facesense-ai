from fastapi import APIRouter, UploadFile, File, Form
import base64

router = APIRouter(prefix="/api/profile", tags=["Profile"])

USER_PROFILE = {
    "name": "Demo User",
    "email": "demo@facesense.ai",
    "role": "USER",
    "status": "Active",
    "photo": None
}

@router.get("/")
def get_profile():
    return USER_PROFILE


@router.put("/")
async def update_profile(
    name: str = Form(...),
    email: str = Form(...),
    photo: UploadFile = File(None)
):
    USER_PROFILE["name"] = name
    USER_PROFILE["email"] = email

    if photo:
        content = await photo.read()
        USER_PROFILE["photo"] = base64.b64encode(content).decode("utf-8")

    return {"message": "Profile updated successfully"}
