from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database.database import Base, engine
from .routes import front_stats

from .models.categories import Categories
from .models.groceryItems import GroceryItems
from .models.receipts import Receipts
from .models.stores import Stores

from .routes import groceryItems
from .routes import receipts

from . import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, debug=settings.debug)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(front_stats.router)
app.include_router(groceryItems.router)
app.include_router(receipts.router)


@app.get("/")
async def root():
    return {"message": "Welcome to the Open Shelf API"}
