from fastapi import FastAPI

from .config import settings
from .database import Base, engine

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, debug=settings.debug)


@app.get("/")
async def root():
    return {"message": "Welcome to the Open Shelf API"}
