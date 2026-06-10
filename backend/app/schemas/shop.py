from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel
from app.models.shop import ShopStatus


class ShopCreate(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    logo: Optional[str] = None
    banner: Optional[str] = None
    city: Optional[str] = None
    response_time: Optional[str] = None
    delivery_conditions: Optional[str] = None
    return_conditions: Optional[str] = None


class ShopUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    logo: Optional[str] = None
    banner: Optional[str] = None
    city: Optional[str] = None
    response_time: Optional[str] = None
    delivery_conditions: Optional[str] = None
    return_conditions: Optional[str] = None
    status: Optional[ShopStatus] = None


class ShopOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    seller_id: str
    name: str
    slug: str
    description: Optional[str] = None
    logo: Optional[str] = None
    banner: Optional[str] = None
    city: Optional[str] = None
    rating: Decimal
    review_count: int
    sales_count: int
    response_time: Optional[str] = None
    status: ShopStatus
    delivery_conditions: Optional[str] = None
    return_conditions: Optional[str] = None
    created_at: datetime
