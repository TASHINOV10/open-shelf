from pydantic import BaseModel
from datetime import date

class PriceCreate(BaseModel):
    grocery_name: str
    category: str
    brand: str
    price: float
    currency: str
    location: str
    date: date 
