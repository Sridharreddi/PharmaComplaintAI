from sqlalchemy.orm import Session
from app.models.complaint import Complaint
from app.schemas.complaint import ComplaintCreate
from app.ai.graph import graph
import uuid


def generate_complaint_number():
    return f"CMP-{uuid.uuid4().hex[:8].upper()}"


def create_complaint(db, complaint):

    ai_result = graph.invoke(
        {
            "description": complaint.description
        }
    )

    new_complaint = Complaint(
        complaint_number=generate_complaint_number(),
        customer_name=complaint.customer_name,
        product_name=complaint.product_name,
        batch_number=complaint.batch_number,
        description=complaint.description,

        summary=ai_result["summary"],
        category=ai_result["category"],
        priority=ai_result["priority"],
        severity=ai_result["severity"],
        recommended_action=ai_result["recommended_action"],

        status="Open"
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    return new_complaint


def get_all_complaints(db: Session):
    return db.query(Complaint).all()