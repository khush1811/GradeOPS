from sqlalchemy import Column, Integer, String, Text,Float, Boolean
from app.core.database import Base


class Answer(Base):
    __tablename__ = "answers"

    id = Column(Integer, primary_key=True, index=True)

    image = Column(String, nullable=False)

    extracted_text = Column(Text, nullable=False)

    score = Column(Integer, nullable=False)

    max_score = Column(Integer, nullable=False, default=10)

    reason = Column(Text)

    status = Column(String, default="PENDING")
    
    session_id = Column(String, nullable=False)
    
    plagiarism_score = Column(Float, default=0)

    is_flagged = Column(Boolean, default=False)
    
    