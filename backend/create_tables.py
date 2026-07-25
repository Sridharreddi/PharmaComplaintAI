from app.database.database import engine
from app.models.complaint import Complaint
from app.database.database import Base

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("✅ Tables created successfully!")