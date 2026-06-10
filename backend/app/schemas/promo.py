from datetime import date
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel
from app.models.promo_code import PromoType


class PromoCreate(BaseModel):
    code: str
    type: PromoType
    value: Decimal = 0
    min_order_amount: Decimal = 0
    usage_limit: int = 0
    expires_at: Optional[date] = None


class PromoValidateRequest(BaseModel):
    code: str
    order_amount: Decimal


class PromoOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    code: str
    type: PromoType
    value: Decimal
    min_order_amount: Decimal
    usage_limit: int
    usage_count: int
    expires_at: Optional[date] = None
    is_active: bool
