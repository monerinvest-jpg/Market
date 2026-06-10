import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class UserRole(str, enum.Enum):
    admin  = "admin"
    seller = "seller"
    buyer  = "buyer"


class User(Base):
    __tablename__ = "users"

    id            = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name          = Column(String(100), nullable=False)
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role          = Column(Enum(UserRole), nullable=False, default=UserRole.buyer)
    phone         = Column(String(20))
    city          = Column(String(100))
    avatar        = Column(String(500))
    bio           = Column(String(500))
    bonus_balance = Column(Integer, default=0)
    referral_code = Column(String(20), unique=True)
    is_blocked    = Column(Boolean, default=False)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    shop          = relationship("Shop", back_populates="seller", uselist=False)
    products      = relationship("Product", back_populates="seller")
    orders        = relationship("Order", back_populates="user")
    reviews       = relationship("Review", back_populates="user")
    cart_items    = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    favorites     = relationship("Favorite", back_populates="user", cascade="all, delete-orphan")
    sent_messages = relationship("Message", foreign_keys="Message.from_id", back_populates="sender")
