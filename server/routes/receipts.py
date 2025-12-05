from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
import shutil
import os
import uuid

from sqlalchemy.orm import Session

from server.services.openai_receipt_parser import parse_receipt_image
from server.database.database import get_db
from server.schemas.receipt_confirm import ConfirmReceiptIn
from server.models.stores import Stores
from server.models.receipts import Receipts
from server.models.groceryItems import GroceryItems  # adjust filename if needed

router = APIRouter()

UPLOAD_DIR = "uploaded_receipts"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload-receipt")
async def upload_receipt(file: UploadFile = File(...)):

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    # 0) Generate a unique external receipt ID (UUID)
    receipt_id = str(uuid.uuid4())

    # 1) Determine file extension and build unique filename
    original_ext = os.path.splitext(file.filename)[1].lower()  # ".jpg", ".jpeg", ".png", ...
    if original_ext == "":
        original_ext = ".jpg"  # fallback

    unique_filename = f"{receipt_id}{original_ext}"
    file_location = os.path.join(UPLOAD_DIR, unique_filename)

    # 2) Save file locally
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"[Receipts] Saved file to {file_location}")

    # 3) Send saved file to OpenAI parser
    parsed = parse_receipt_image(file_location)

    if parsed is None:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse receipt using OpenAI"
        )

    # 4) Return parsed result + IDs to the frontend
    return {
        "message": "Upload + parsing complete",
        "receipt_id": receipt_id,          # <-- IMPORTANT
        "original_filename": file.filename,
        "saved_filename": unique_filename,
        "parsed_receipt": parsed,
    }


@router.post("/confirm-receipt")
def confirm_receipt(
    payload: ConfirmReceiptIn,
    db: Session = Depends(get_db),
):
    """
    Called when the user presses 'Потвърди качването' in the UI.

    Persists:
      - Store (stores table)
      - Receipt (receipts table, matched by external_id = receipt_id)
      - Grocery items (grocery_items table)
    """

    # 1) Find or create store by (name, location)
    store = (
        db.query(Stores)
        .filter(
            Stores.name == payload.store.name,
            Stores.location == payload.store.location,
        )
        .first()
    )

    if store is None:
        store = Stores(
            name=payload.store.name,
            location=payload.store.location,
        )
        db.add(store)
        db.flush()  # get store.pk_id

    # 2) Find or create receipt by external_id (the UUID)
    receipt = (
        db.query(Receipts)
        .filter(Receipts.external_id == payload.receipt_id)
        .first()
    )

    if receipt is None:
        receipt = Receipts(
            external_id=payload.receipt_id,
            post_date=payload.receipt.post_date,
            fk_store_id=store.pk_id,
        )
        db.add(receipt)
        db.flush()  # get receipt.pk_id
    else:
        # Update meta if user edited it
        receipt.post_date = payload.receipt.post_date
        receipt.fk_store_id = store.pk_id

    # 3) Insert grocery items for this receipt
    # (simple version = always insert new rows; later we can do smarter "update")
    for item in payload.items:
        if not item.name:
            continue  # skip empty names

        db_item = GroceryItems(
            name=item.name,
            price=item.price if item.price is not None else 0.0,
            currency=item.currency,
            post_date=payload.receipt.post_date,
            fk_receipt_id=receipt.pk_id,
            fk_store_id=store.pk_id,
        )
        db.add(db_item)

    db.commit()
    db.refresh(receipt)

    return {
        "message": "Receipt and items saved successfully.",
        "receipt_db_id": receipt.pk_id,
        "store_id": store.pk_id,
    }
