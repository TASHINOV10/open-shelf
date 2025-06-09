from pydantic import BaseModel
from datetime import date

class PriceCreate(BaseModel):
    product: str
    store: str
    price: float
    date: date
