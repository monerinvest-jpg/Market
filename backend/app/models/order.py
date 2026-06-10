import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, DateTime, Enum, ForeignKey,
    Integer, Numeric, String, Text,
)
from sqlalchemy.orm import relationship

from app.database import Base


class OrderStatus(str, enum.Enum):
    new        = "new"
    paid       = "paid"
    shipped    = "shipped"
    delivered  = "delivered"
    completed  = "completed"
    cancelled  = "cancelled"


class Order(Base):
    __tablename__ = "orders"

    id               = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id          = Column(String(36), ForeignKey("users.id"), nullable=False, index=True)
    promo_id         = Column(String(36), ForeignKey("promo_codes.id"), nullable=True)
    status           = Column(Enum(OrderStatus), default=OrderStatus.new, index=True)
    total_amount     = Column(Numeric(10, 2), nullable=False)
    delivery_amount  = Column(Numeric(10, 2), default=0)
    discount_amount  = Column(Numeric(10, 2), default=0)
    delivery_address = Column(Text)
    delivery_method  = Column(String(100))
    payment_method   = Column(String(100))
    track_number     = Column(String(100))
    created_at       = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at       = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user       = relationship("User", back_populates="orders")
    promo_code = relationship("PromoCode")
    items      = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"

    id            = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    order_id      = Column(String(36), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id    = Column(String(36), ForeignKey("products.id"), nullable=False)
    shop_id       = Column(String(36), ForeignKey("shops.id"), nullable=False)
    product_name  = Column(String(300), nullable=False)
    product_image = Column(String(500))
    shop_name     = Column(String(200))
    price         = Column(Numeric(10, 2), nullable=False)
    quantity      = Column(Integer, default=1)
    variant       = Column(String(200))

    # Relationships
    order   = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
