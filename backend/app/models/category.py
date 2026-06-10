import uuid
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id            = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    parent_id     = Column(String(36), ForeignKey("categories.id"), nullable=True, index=True)
    name          = Column(String(100), nullable=False)
    slug          = Column(String(100), unique=True, nullable=False, index=True)
    icon          = Column(String(20))
    product_count = Column(Integer, default=0)
    sort_order    = Column(Integer, default=0)

    # Relationships
    children  = relationship("Category", backref="parent", foreign_keys=[parent_id])
    products  = relationship("Product", back_populates="category")
