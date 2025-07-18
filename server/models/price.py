from sqlalchemy import Column, Integer, String, Float, Date
from ..database import Base

class Price(Base):
    __tablename__ = "prices"

    id = Column(Integer, primary_key=True, index=True)
    grocery_name =  Column(String, index=True)
    category = Column(String)
    brand = Column(String)
    price = Column(Float)
    currency = Column(String)
    location = Column(String)
    date = Column(Date)
