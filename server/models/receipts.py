from sqlalchemy import Column, Integer, Date, ForeignKey, String, DateTime
from sqlalchemy.sql import func
from ..database.database import Base

class Receipts(Base):
    __tablename__ = "receipts"

    pk_id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, index=True, nullable=False)
    post_date = Column(Date, nullable=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fk_store_id = Column(Integer, ForeignKey("stores.pk_id"))
