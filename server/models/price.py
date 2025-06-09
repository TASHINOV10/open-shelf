from sqlalchemy import Column, Integer, String, Float, Date
from ..database import Base

class Price(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)
    product = Column(String, index=True)
    store = Column(String)
    price = Column(Float)
    date = Column(Date)
