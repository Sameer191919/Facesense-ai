from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    password = Column(String)

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True)
    user_email = Column(String)
    sentiment = Column(String)
    emotion = Column(String)
    transcript = Column(Text)
