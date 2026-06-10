from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel


class CartItemCreate(BaseModel):
    product_id: str
    quantity: int = 1
    variant: Optional[str] = None


class CartItemUpdate(BaseModel):
    quantity: int


class CartItemOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    product_id: str
    quantity: int
    variant: Optional[str] = None


class CartOut(BaseModel):
    items: List[CartItemOut]
    total: Decimal
