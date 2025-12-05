from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from ..database.database import Base

class GroceryItems(Base):
    __tablename__ = "grocery_items" 

    pk_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)

    fk_category_id = Column(
        Integer,
        ForeignKey("categories.pk_id"),
        nullable=True,
    )
    price = Column(Float, nullable=False)
    currency = Column(String, nullable=True)
    post_date = Column(Date, nullable=True)

    fk_receipt_id = Column(
        Integer,
        ForeignKey("receipts.pk_id"),
        nullable=False,
    )
    fk_store_id = Column(
        Integer,
        ForeignKey("stores.pk_id"),
        nullable=False,
    )
