import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey,
    Integer, JSON, Numeric, String, Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class ProductStatus(str, enum.Enum):
    active   = "active"
    pending  = "pending"
    rejected = "rejected"


class Product(Base):
    __tablename__ = "products"

    id              = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    shop_id         = Column(String(36), ForeignKey("shops.id", ondelete="CASCADE"), nullable=False, index=True)
    seller_id       = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id     = Column(String(36), ForeignKey("categories.id"), index=True)
    name            = Column(String(300), nullable=False)
    slug            = Column(String(300), unique=True, nullable=False, index=True)
    description     = Column(Text, nullable=False)
    price           = Column(Numeric(10, 2), nullable=False)
    old_price       = Column(Numeric(10, 2))
    images          = Column(JSON, default=list)
    tags            = Column(JSON, default=list)
    materials       = Column(JSON, default=list)
    colors          = Column(JSON, default=list)
    sizes           = Column(JSON, default=list)
    delivery_methods = Column(JSON, default=list)
    rating          = Column(Numeric(3, 2), default=0)
    review_count    = Column(Integer, default=0)
    sales_count     = Column(Integer, default=0)
    in_stock        = Column(Boolean, default=True)
    stock_count     = Column(Integer, default=0)
    production_days = Column(Integer, default=1)
    is_digital      = Column(Boolean, default=False)
    is_customizable = Column(Boolean, default=False)
    weight          = Column(Integer)
    city            = Column(String(100))
    status          = Column(Enum(ProductStatus), default=ProductStatus.pending, index=True)
    is_featured     = Column(Boolean, default=False, index=True)
    created_at      = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    shop        = relationship("Shop", back_populates="products")
    seller      = relationship("User", back_populates="products")
    category    = relationship("Category", back_populates="products")
    reviews     = relationship("Review", back_populates="product")
    cart_items  = relationship("CartItem", back_populates="product")
    favorites   = relationship("Favorite", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
