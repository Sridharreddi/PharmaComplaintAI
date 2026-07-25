from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ComplaintRequest(BaseModel):
    customerName: str
    productName: str
    productStrength: Optional[str] = ""
    batchNumber: Optional[str] = ""
    manufacturingDate: Optional[str] = ""
    expiryDate: Optional[str] = ""
    quantityAffected: Optional[str] = ""
    quantityUnit: Optional[str] = ""
    complaintType: Optional[str] = ""
    complaintDate: Optional[str] = ""
    description: str
    severity: Optional[str] = ""
    priority: Optional[str] = ""


class ComplaintCreate(BaseModel):
    customer_name: str
    product_name: str
    batch_number: str
    description: str


class ComplaintResponse(BaseModel):
    id: int
    complaint_number: str
    customer_name: str
    product_name: str
    batch_number: str
    description: str
    category: Optional[str]
    priority: Optional[str]
    severity: Optional[str]
    status: str
    summary: Optional[str]
    recommended_action: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True