from fastapi import APIRouter, UploadFile, File
import shutil
import os

from app.services.pdf_service import pdf_to_images
from app.services.ocr_service import extract_text
from app.services.grader_service import grade_answer

router = APIRouter()

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # ---- SAVE PDF ----
    pdf_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(pdf_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ---- PDF → IMAGES ----
    image_paths = pdf_to_images(pdf_path, OUTPUT_DIR)

    results = []

    # ---- PROCESS EACH PAGE ----
    for img_path in image_paths:

        # OCR
        text = extract_text(img_path)

        # GRADING
        grade = grade_answer(text)

        results.append({
            "image": img_path,
            "text": text,
            "grading": grade
        })

    return {
        "message": "Processing complete",
        "results": results
    }