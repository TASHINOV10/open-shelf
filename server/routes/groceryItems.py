from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.database import get_db
from ..models.groceryItems import GroceryItems as GroceryItemModel
from ..schemas.groceryItems import GroceryItem as GroceryItemSchema

router = APIRouter(
    prefix="/grocery-items",
    tags=["grocery-items"],
)

@router.post("/", response_model=GroceryItemSchema)
def create_grocery_item(
    item: GroceryItemSchema,
    db: Session = Depends(get_db),
):
    new_item = GroceryItemModel(**item.dict())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item
