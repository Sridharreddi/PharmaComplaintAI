from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from dotenv import load_dotenv
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database.database import get_db
from app.models.complaint import Complaint as ComplaintModel
from app.schemas.complaint import ComplaintRequest

import json
import os
import io
import pdfplumber

from typing import TypedDict, Optional

from langchain_groq import ChatGroq
from langgraph.graph import StateGraph, END

# =====================================================
# LOAD ENVIRONMENT VARIABLES
# =====================================================

load_dotenv()

app = FastAPI(title="AIVOA QMS AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# GROQ CONFIGURATION
# =====================================================

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemma2-9b-it")

print("Groq Key Loaded:", GROQ_API_KEY[:10] if GROQ_API_KEY else "NOT FOUND")
print("Model:", MODEL_NAME)

llm = ChatGroq(
    model_name=MODEL_NAME,
    groq_api_key=GROQ_API_KEY,
    temperature=0.1,
)

# =====================================================
# LANGGRAPH STATE
# =====================================================

class ComplaintState(TypedDict):
    raw_text: str
    extracted_data: Optional[str]

# =====================================================
# LANGGRAPH NODE
# =====================================================

def extract_fields_node(state: ComplaintState):

    prompt = f"""
You are an AI Pharmaceutical Quality Assurance Assistant.

Extract complaint details from the text below.

-----------------------
{state["raw_text"]}
-----------------------

Return ONLY a valid JSON object.

Do NOT use markdown.
Do NOT wrap the response in ```json.
Do NOT explain anything.

Use these keys exactly:

customerName
productName
productStrength
batchNumber
manufacturingDate
expiryDate
quantityAffected
quantityUnit
complaintType
complaintDate
description
severity
priority
"""

    response = llm.invoke(prompt)

    return {
        "extracted_data": response.content
    }

# =====================================================
# LANGGRAPH WORKFLOW
# =====================================================

workflow = StateGraph(ComplaintState)

workflow.add_node("extractor", extract_fields_node)

workflow.set_entry_point("extractor")

workflow.add_edge("extractor", END)

app_graph = workflow.compile()

# =====================================================
# FILE TEXT EXTRACTION
# =====================================================

def extract_text_from_file(file_name: str, content: bytes):

    extension = file_name.lower().split(".")[-1]

    if extension == "txt":
        return content.decode("utf-8", errors="ignore")

    elif extension == "pdf":

        text = ""

        with pdfplumber.open(io.BytesIO(content)) as pdf:

            for page in pdf.pages:

                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return text

    else:
        raise Exception(f"Unsupported file type: {extension}")
    # =====================================================
# AI EXTRACTION API
# =====================================================

@app.post("/api/extract-complaint")
async def extract_complaint(file: UploadFile = File(...)):

    try:

        # Read uploaded file
        content = await file.read()

        # Extract text from PDF/TXT
        text = extract_text_from_file(
            file.filename,
            content
        )

        if not text.strip():
            return {
                "success": False,
                "message": "No text could be extracted from the uploaded file."
            }

        # Send text to LangGraph / Groq
        result = app_graph.invoke(
            {
                "raw_text": text
            }
        )

        raw = result["extracted_data"].strip()

        # Remove Markdown code fences if Groq returns them
        if raw.startswith("```json"):
            raw = raw.replace("```json", "", 1)

        if raw.startswith("```"):
            raw = raw.replace("```", "", 1)

        if raw.endswith("```"):
            raw = raw[:-3]

        raw = raw.strip()

        # Convert JSON string to Python dictionary
        try:
            extracted = json.loads(raw)

        except json.JSONDecodeError:

            extracted = {
                "customerName": "",
                "productName": "",
                "productStrength": "",
                "batchNumber": "",
                "manufacturingDate": "",
                "expiryDate": "",
                "quantityAffected": "",
                "quantityUnit": "",
                "complaintType": "",
                "complaintDate": "",
                "description": "",
                "severity": "",
                "priority": "",
                "rawResponse": raw
            }

        return {
            "success": True,
            "filename": file.filename,
            "extractedText": text,
            "data": extracted
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }
    # =====================================================
# TEMPORARY IN-MEMORY DATABASE
# =====================================================

# =====================================================
# COMPLAINT MODEL
# =====================================================

class ComplaintRequest(BaseModel):
    complaintSource: str
    customerName: str
    productName: str
    productStrength: str
    batchNumber: str
    manufacturingDate: str
    expiryDate: str
    quantityAffected: str
    quantityUnit: str
    complaintType: str
    complaintDate: str
    description: str
    severity: str
    priority: str

# =====================================================
# CREATE COMPLAINT
# =====================================================

from fastapi import Request

@app.post("/complaints")
async def create_complaint(
    request: Request,
    db: Session = Depends(get_db)
):
    data = await request.json()

    complaint = ComplaintModel(
        complaint_number=f"CMP-{db.query(ComplaintModel).count()+1:04}",

        customer_name=data.get("customerName"),
        product_name=data.get("productName"),
        product_strength=data.get("productStrength"),

        batch_number=data.get("batchNumber"),

        manufacturing_date=data.get("manufacturingDate"),
        expiry_date=data.get("expiryDate"),

        quantity_affected=data.get("quantityAffected"),
        quantity_unit=data.get("quantityUnit"),

        complaint_date=data.get("complaintDate"),

        description=data.get("description"),

        category=data.get("complaintType"),

        priority=data.get("priority"),

        severity=data.get("severity"),

        summary="",

        recommended_action="",

        status="Open"
    )

    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return {
        "success": True,
        "message": "Complaint saved successfully",
        "data": {
            "id": complaint.id
        }
    }
# =====================================================
# GET ALL COMPLAINTS
# =====================================================

@app.get("/complaints")
async def get_complaints(
    db: Session = Depends(get_db)
):
    complaints = db.query(ComplaintModel).all()

    return {
        "success": True,
        "count": len(complaints),
        "data": [
            {
                "id": c.id,
                "complaintNumber": c.complaint_number,
                "customerName": c.customer_name,
                "productName": c.product_name,
                "productStrength": c.product_strength,
                "batchNumber": c.batch_number,
                "manufacturingDate": c.manufacturing_date,
                "expiryDate": c.expiry_date,
                "quantityAffected": c.quantity_affected,
                "quantityUnit": c.quantity_unit,
                "complaintType": c.category,
                "complaintDate": c.complaint_date,
                "description": c.description,
                "priority": c.priority,
                "severity": c.severity,
                "status": c.status,
                "summary": c.summary,
                "recommendedAction": c.recommended_action,
            }
            for c in complaints
        ]
    }
@app.delete("/complaints/{id}")
async def delete_complaint(
    id: int,
    db: Session = Depends(get_db)
):
    complaint = db.query(ComplaintModel).filter(
        ComplaintModel.id == id
    ).first()

    if complaint is None:
        return {
            "success": False,
            "message": "Complaint not found"
        }

    db.delete(complaint)
    db.commit()

    return {
        "success": True,
        "message": "Complaint deleted successfully"
    }
@app.post("/api/generate-summary")
async def generate_summary(data: ComplaintRequest):

    prompt = f"""
    You are an experienced Pharmaceutical Quality Assurance (QA) specialist.

    Analyze the following customer complaint and write a concise professional summary.

    Complaint Details:
    Customer Name: {data.customerName}
    Product Name: {data.productName}
    Product Strength: {data.productStrength}
    Batch Number: {data.batchNumber}
    Manufacturing Date: {data.manufacturingDate}
    Expiry Date: {data.expiryDate}
    Quantity Affected: {data.quantityAffected} {data.quantityUnit}
    Complaint Type: {data.complaintType}
    Complaint Description:
    {data.description}

    Generate a summary that includes:
    1. Product involved.
    2. Nature of the complaint.
    3. Potential quality or patient risk.
    4. Suggested immediate investigation.
    5. Overall severity in one sentence.

    Keep the summary professional, clear, and between 100 and 150 words.
    Do not use markdown, bullet points, or headings.
    """

    response = llm.invoke(prompt)

    return {
        "success": True,
        "summary": response.content
    }
class ChatRequest(BaseModel):
    question: str
    complaint: str


@app.post("/api/chat")
async def chat(request: ChatRequest):

    prompt = f"""
You are an AI Pharmaceutical Quality Assurance Assistant.

Complaint Information:
{request.complaint}

User Question:
{request.question}

Answer only based on the complaint.
If the answer is not available in the complaint, say:
'The uploaded complaint does not contain that information.'

Keep the answer professional and concise.
"""

    response = llm.invoke(prompt)

    return {
        "success": True,
        "answer": response.content
    }
# =====================================================
# HEALTH CHECK
# =====================================================

@app.get("/")
async def root():

    return {
        "success": True,
        "message": "AIVOA Pharma Complaint AI Backend Running",
        "version": "1.0.0"
    }
