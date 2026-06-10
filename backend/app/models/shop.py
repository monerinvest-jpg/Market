import enum
import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, Integer, Numeric, String, Text
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class ShopStatus(str, enum.Enum):
    active  = "active"
    pending = "pending"
    blocked = "blocked"


class Shop(Base):
    __tablename__ = "shops"

    id                  = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    seller_id           = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    name                = Column(String(200), nullable=False)
    slug                = Column(String(200), unique=True, nullable=False, index=True)
    description         = Column(Text)
    logo                = Column(String(500))
    banner              = Column(String(500))
    city                = Column(String(100))
    rating              = Column(Numeric(3, 2), default=0)
    review_count        = Column(Integer, default=0)
    sales_count         = Column(Integer, default=0)
    response_time       = Column(String(50))
    status              = Column(Enum(ShopStatus), default=ShopStatus.active)
    delivery_conditions = Column(Text)
    return_conditions   = Column(Text)
    created_at          = Column(DateTime, default=datetime.utcnow)
    updated_at          = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    seller   = relationship("User", back_populates="shop")
    products = relationship("Product", back_populates="shop", cascade="all, delete-orphan")
    reviews  = relationship("Review", back_populates="shop")
