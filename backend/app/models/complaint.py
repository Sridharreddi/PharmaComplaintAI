from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func

from app.database.database import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)

    complaint_number = Column(String(50), unique=True, nullable=False)

    customer_name = Column(String(100), nullable=False)

    product_name = Column(String(100), nullable=False)

    product_strength = Column(String(100))

    batch_number = Column(String(100))

    manufacturing_date = Column(String(50))

    expiry_date = Column(String(50))

    quantity_affected = Column(String(50))

    quantity_unit = Column(String(50))

    complaint_date = Column(String(50))

    description = Column(Text, nullable=False)

    category = Column(String(100))

    priority = Column(String(50))

    severity = Column(String(50))

    status = Column(String(50), default="Open")

    summary = Column(Text)

    recommended_action = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())