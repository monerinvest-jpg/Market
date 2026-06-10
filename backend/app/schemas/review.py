from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    product_id: str
    shop_id: str
    rating: int = Field(..., ge=1, le=5)
    text: Optional[str] = None
    quality_rating: Optional[int] = Field(None, ge=1, le=5)
    delivery_rating: Optional[int] = Field(None, ge=1, le=5)
    communication_rating: Optional[int] = Field(None, ge=1, le=5)


class ReviewOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    user_id: str
    product_id: str
    shop_id: str
    rating: int
    text: Optional[str] = None
    quality_rating: Optional[int] = None
    delivery_rating: Optional[int] = None
    communication_rating: Optional[int] = None
    seller_reply: Optional[str] = None
    created_at: datetime


class SellerReplyRequest(BaseModel):
    reply: str
