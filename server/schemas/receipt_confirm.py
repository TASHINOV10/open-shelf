from datetime import date
from typing import List, Optional
from pydantic import BaseModel
from datetime import date


EUR_SWITCH_DATE = date(2026, 1, 1)

def infer_currency(purchase_date: date | None ) -> str:

    if purchase_date and purchase_date < EUR_SWITCH_DATE:
        return "BGN"
    
    return "EUR"


class StoreIn(BaseModel):
    name: str
    location: Optional[str] = None


class ReceiptMetaIn(BaseModel):
    # Pydantic will parse "YYYY-MM-DD" strings into date automatically
    post_date: Optional[date] = None


class ItemIn(BaseModel):
    name: str
    price: Optional[float] = None
    currency: Optional[str] = None


class ConfirmReceiptIn(BaseModel):
    # This is the UUID we returned from /upload-receipt
    receipt_id: str

    store: StoreIn
    receipt: ReceiptMetaIn
    items: List[ItemIn]
