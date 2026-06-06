from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.database import engine, Base, SessionLocal
from app.models.answer import Answer

from app.services.plagiarism_service import check_plagiarism

import os
import shutil
import uuid

Base.metadata.create_all(bind=engine)

# ✅ Updated imports (after restructuring)
from app.services.pdf_service import pdf_to_images
from app.services.ocr_service import extract_text
from app.services.grader_service import grade_answer

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs") 


@app.get("/answers")
def get_answers(session_id: str = None):
    db = SessionLocal()

    if session_id:
        answers = db.query(Answer).filter(Answer.session_id == session_id).all()
    else:
        answers = db.query(Answer).all()

    db.close()

    return [
        {
            "id": a.id,
            "image": a.image,
            "text": a.extracted_text,
            "score": a.score,
            "max_score": a.max_score,
            "reason": a.reason,
            "status": a.status,
            "session_id": a.session_id   
        }
        for a in answers
    ]


@app.post("/process/")
async def process(
    file: UploadFile = File(...),
    rubric: str = Form(...)
):

    db = SessionLocal()   # ✅ OUTSIDE loop

    try:
        session_id = str(uuid.uuid4())
        output_folder = os.path.join("outputs", session_id)
        os.makedirs(output_folder, exist_ok=True)

        print("Created session:", session_id)

        file_path = os.path.join(UPLOAD_DIR, file.filename)

        with open(file_path, "wb") as f:
            f.write(await file.read())

        image_paths = pdf_to_images(file_path, output_folder)

        results = []
        
        existing_answers = db.query(Answer).all()
        existing_texts = [a.extracted_text for a in existing_answers if a.extracted_text]

        for img in image_paths:
            print("Saving image path:", img)
            text = extract_text(img)
            grade = grade_answer(text, rubric)
            
            plagiarism = check_plagiarism(text, existing_texts)
            
            existing_texts.append(text)

            answer = Answer(
                image=img.replace("\\", "/"),
                extracted_text=text,
                score=grade.get("score", 0),
                max_score=grade.get("max_score", 10),
                reason=grade.get("reason", ""),
                status="PENDING",
                session_id=session_id,
                
                plagiarism_score=plagiarism["similarity"],
                is_flagged=plagiarism["flag"]
            )

            db.add(answer)
            db.commit()
            db.refresh(answer)

            results.append({
                "id": answer.id,
                "image": img,
                "text": text[:500],
                "grading": grade
            })

        db.close()

        return {"status": "success", "results": results}

    except Exception as e:
        db.rollback()
        db.close()
        return {"status": "error", "message": str(e)}
    
@app.post("/review/{answer_id}")
def review_answer(answer_id: int, final_score: int):

    db = SessionLocal()

    try:
        answer = db.query(Answer).filter(Answer.id == answer_id).first()

        if not answer:
            return {"error": "Answer not found"}

        answer.score = final_score
        answer.status = "REVIEWED"

        db.commit()
        db.refresh(answer)

        return {
            "message": "Answer reviewed successfully",
            "id": answer.id,
            "final_score": answer.score,
            "status": answer.status
        }

    except Exception as e:
        db.rollback()
        return {"error": str(e)}

    finally:
        db.close()