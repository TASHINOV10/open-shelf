from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from .routes import price
from .routes import receipt  # assuming you named the file receipt.py


# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title=settings.app_name, debug=settings.debug)

# ✅ Enable CORS for both localhost and 127.0.0.1
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://192.168.137.1:3000",  # laptop hotspot origin
        "http://10.212.89.14:3000"   # USB-tether origin (just in case)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(price.router)
app.include_router(receipt.router)  # ✅ Add this line


@app.get("/")
async def root():
    return {"message": "Welcome to the Open Shelf API"}
