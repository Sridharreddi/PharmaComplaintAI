from dotenv import load_dotenv
import os

load_dotenv()

print("DATABASE_URL =", os.getenv("DATABASE_URL"))

from app.database.database import engine

try:
    with engine.connect() as conn:
        print("✅ SQLAlchemy Connected Successfully!")
except Exception as e:
    print("❌ SQLAlchemy Failed")
    print(e)