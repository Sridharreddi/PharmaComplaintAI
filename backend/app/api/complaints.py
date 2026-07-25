from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.schemas.complaint import ComplaintCreate
from app.services.complaint_service import (
    create_complaint,
    get_all_complaints,
)

router = APIRouter(prefix="/complaints", tags=["Complaints"])


@router.post("/")
def create(data: ComplaintCreate, db: Session = Depends(get_db)):
    return create_complaint(db, data)


@router.get("/")
def get_all(db: Session = Depends(get_db)):
    return get_all_complaints(db)