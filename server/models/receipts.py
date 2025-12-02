from sqlalchemy import Column, Integer, Date, ForeignKey
from ..database.database import Base

class Receipts(Base):
    __tablename__ = "receipts"

    pk_id = Column(Integer, primary_key=True, index=True)
    post_date = Column(Date, nullable=False)
    fk_store_id = Column(Integer, ForeignKey("stores.pk_id"))
