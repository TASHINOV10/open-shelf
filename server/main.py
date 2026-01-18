from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database.database import Base, engine

from .routes import front_stats
from .routes import groceryItems
from .routes import receipts

from .models.categories import Categories
from .models.groceryItems import GroceryItems
from .models.receipts import Receipts
from .models.stores import Stores

from . import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    redoc_url="/api/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://open-shelf.eu",
        "https://www.open-shelf.eu",
        "https://open-shelf-frontend-793683179596.europe-central2.run.app",
        "http://localhost:3000",
        "http://192.168.1.178:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"

app.include_router(front_stats.router, prefix=API_PREFIX)
app.include_router(groceryItems.router, prefix=API_PREFIX)
app.include_router(receipts.router, prefix=API_PREFIX)

@app.get("/")
async def root():
    return {"message": "Welcome to the Open Shelf API. See /api/docs for documentation."}
