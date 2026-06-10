import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id                   = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id              = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id           = Column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    shop_id              = Column(String(36), ForeignKey("shops.id", ondelete="CASCADE"), nullable=False, index=True)
    rating               = Column(Integer, nullable=False)
    text                 = Column(Text)
    quality_rating       = Column(Integer)
    delivery_rating      = Column(Integer)
    communication_rating = Column(Integer)
    seller_reply         = Column(Text)
    created_at           = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user    = relationship("User", back_populates="reviews")
    product = relationship("Product", back_populates="reviews")
    shop    = relationship("Shop", back_populates="reviews")
