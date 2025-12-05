# server/schemas/receipt_confirm.py

from datetime import date
from typing import List, Optional
from pydantic import BaseModel


class StoreIn(BaseModel):
    name: str
    location: Optional[str] = None


class ReceiptMetaIn(BaseModel):
    # Pydantic will parse "YYYY-MM-DD" strings into date automatically
    post_date: Optional[date] = None


class ItemIn(BaseModel):
    name: str
    price: Optional[float] = None
    currency: Optional[str] = "BGN"


class ConfirmReceiptIn(BaseModel):
    # This is the UUID we returned from /upload-receipt
    receipt_id: str

    store: StoreIn
    receipt: ReceiptMetaIn
    items: List[ItemIn]
