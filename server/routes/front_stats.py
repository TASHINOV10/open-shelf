from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel

from ..database.database import get_db
from ..models.groceryItems import GroceryItems
from ..models.receipts import Receipts
from ..models.stores import Stores

router = APIRouter(prefix="/front_stats", tags=["front_stats"])


class DashboardStats(BaseModel):
    total_receipts: int
    total_stores: int
    total_locations: int
    total_items: int


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    total_receipts, total_stores, total_items, total_locations = db.query(
        func.count(func.distinct(Receipts.pk_id)),
        func.count(func.distinct(Stores.name)),
        func.count(func.distinct(GroceryItems.name)),
        func.count(func.distinct(Stores.location)),
    ).one()

    total_receipts = total_receipts or 0
    total_stores = total_stores or 0
    total_items = total_items or 0
    total_locations = total_locations or 0

    return DashboardStats(
        total_receipts=total_receipts,
        total_stores=total_stores,
        total_locations=total_locations,
        total_items=total_items,
    )

