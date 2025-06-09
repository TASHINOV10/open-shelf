from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.price import Price
from ..schemas.price import PriceCreate

router = APIRouter()

@router.post("/prices")
def create_price(price: PriceCreate, db: Session = Depends(get_db)):
    new_price = Price(**price.dict())
    db.add(new_price)
    db.commit()
    db.refresh(new_price)
    return new_price
