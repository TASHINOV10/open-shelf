from sqlalchemy import Column, Integer, String
from ..database.database import Base

class Stores(Base):
    __tablename__ = "stores"

    pk_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    location = Column(String)
