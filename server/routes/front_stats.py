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
    # COUNT(DISTINCT receipts.pk_id)
    total_receipts = (
        db.query(func.count(func.distinct(Receipts.pk_id))).scalar() or 0
    )

    # COUNT(DISTINCT stores.name)
    total_stores = (
        db.query(func.count(func.distinct(Stores.name))).scalar() or 0
    )

    # For now: treat locations = number of distinct stores
    total_locations = total_stores

    # items: you can choose distinct or not; here I use DISTINCT by name
    total_items = (
        db.query(func.count(func.distinct(GroceryItems.name))).scalar() or 0
    )

    return DashboardStats(
        total_receipts=total_receipts,
        total_stores=total_stores,
        total_locations=total_locations,
        total_items=total_items,
    )
