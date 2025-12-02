from sqlalchemy import Column, Integer, String
from ..database.database import Base

class Categories(Base):
    __tablename__ = "categories"

    pk_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)