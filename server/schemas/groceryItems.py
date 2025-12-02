from pydantic import BaseModel
from datetime import date

class GroceryItem(BaseModel):
    name: str
    fk_category_id: int
    price: float
    currency: str
    post_date: date 
    fk_receipt_id: int
    fk_store_id: int

