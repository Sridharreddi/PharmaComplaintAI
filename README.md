# AI-Powered Pharmaceutical Customer Complaint Management System

## Project Overview

This project is an AI-powered Customer Complaint Management System developed for the AIVOA Full Stack Developer Assessment. The application helps pharmaceutical companies process customer complaints by extracting complaint details from uploaded documents using AI, generating summaries, and storing complaint information in a structured database.

The system uses LangGraph for AI workflow orchestration, Groq's llama-3.3-70b-versatile large language model for intelligent extraction and summarization, FastAPI as the backend, React for the frontend, and PostgreSQL for data storage.

---

## Features

- Upload customer complaint documents
- AI-powered complaint information extraction
- Automatic complaint form filling
- AI-generated complaint summary
- AI chat assistant for complaint-related questions
- Save complaints to PostgreSQL
- View complaint history
- Delete complaints
- LangGraph workflow integration
- FastAPI REST APIs

---

## Technology Stack

### Frontend

- React
- Redux
- Tailwind CSS
- Vite

### Backend

- FastAPI
- Python
- LangGraph
- LangChain
- Groq (llama-3.3-70b-versatile)
- SQLAlchemy

### Database

- PostgreSQL

---

## Project Structure

```
PharmaComplaintAI
│
├── backend
│   ├── app
│   │   ├── ai
│   │   ├── api
│   │   ├── database
│   │   ├── models
│   │   ├── schemas
│   │   └── services
│   ├── requirements.txt
│   └── create_tables.py
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── services
│   │   ├── features
│   │   ├── layouts
│   │   └── pages
│   └── package.json
│
└── README.md
```

---

## AI Workflow

```
Upload Complaint
        │
        ▼
Extract Text
        │
        ▼
LangGraph Workflow
        │
        ▼
Groq (llama-3.3-70b-versatile)
        │
        ▼
Extract Complaint Details
        │
        ▼
Auto Fill Complaint Form
        │
        ▼
Generate AI Summary
        │
        ▼
Store in PostgreSQL
```

---

## Installation

### Backend

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python create_tables.py

python -m uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder.

```env
GROQ_API_KEY=YOUR_GROQ_API_KEY
MODEL_NAME=llama-3.3-70b-versatile
DATABASE_URL=YOUR_DATABASE_URL
```

---

## API Endpoints

### AI

```
POST /api/extract-complaint

POST /api/generate-summary

POST /api/chat
```

### Complaints

```
POST /complaints

GET /complaints

DELETE /complaints/{id}
```

---

## LangGraph

The application uses LangGraph to manage the AI workflow.

Workflow:

- Extract complaint details
- Validate extracted fields
- Generate structured JSON
- Generate AI summary
- Support AI chat interactions

---

## Future Enhancements

- Complaint Completeness Checker
- Root Cause Analysis
- Duplicate Complaint Detection
- CAPA Recommendation
- AI Risk Classification
- OCR Integration
- Email Complaint Processing

---

## Assignment

Developed as part of the **AIVOA Full Stack Developer Assessment**.

---

## Author

**Sridhar Reddy Challa**

GitHub:
https://github.com/Sridharreddi
