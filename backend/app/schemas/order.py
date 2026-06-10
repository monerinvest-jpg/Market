from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel
from app.models.order import OrderStatus


class OrderItemCreate(BaseModel):
    product_id: str
    quantity: int = 1
    variant: Optional[str] = None


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    delivery_address: str
    delivery_method: str
    payment_method: str
    promo_code: Optional[str] = None


class OrderItemOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    product_id: str
    shop_id: str
    product_name: str
    product_image: Optional[str] = None
    shop_name: Optional[str] = None
    price: Decimal
    quantity: int
    variant: Optional[str] = None


class OrderOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    user_id: str
    status: OrderStatus
    total_amount: Decimal
    delivery_amount: Decimal
    discount_amount: Decimal
    delivery_address: Optional[str] = None
    delivery_method: Optional[str] = None
    payment_method: Optional[str] = None
    track_number: Optional[str] = None
    items: List[OrderItemOut] = []
    created_at: datetime
    updated_at: datetime


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
    track_number: Optional[str] = None
