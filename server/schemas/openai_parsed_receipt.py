from pydantic import BaseModel
from typing import List, Optional, Literal

class StoreParsed(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None

class ReceiptParsed(BaseModel):
    post_date: Optional[str] = None 

class ItemParsed(BaseModel):
    name: str
    price: Optional[float] = None

class OpenAIParsedReceipt(BaseModel):
    code: Literal[0, 6969]
    store: StoreParsed
    receipt: ReceiptParsed
    items: List[ItemParsed]
