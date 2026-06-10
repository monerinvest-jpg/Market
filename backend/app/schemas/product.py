from datetime import datetime
from decimal import Decimal
from typing import List, Optional
from pydantic import BaseModel
from app.models.product import ProductStatus


class ProductCreate(BaseModel):
    name: str
    description: str
    price: Decimal
    old_price: Optional[Decimal] = None
    category_id: Optional[str] = None
    images: List[str] = []
    tags: List[str] = []
    materials: List[str] = []
    colors: List[str] = []
    sizes: List[str] = []
    delivery_methods: List[str] = []
    in_stock: bool = True
    stock_count: int = 0
    production_days: int = 1
    is_digital: bool = False
    is_customizable: bool = False
    weight: Optional[int] = None
    city: Optional[str] = None


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    old_price: Optional[Decimal] = None
    category_id: Optional[str] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    materials: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    delivery_methods: Optional[List[str]] = None
    in_stock: Optional[bool] = None
    stock_count: Optional[int] = None
    is_featured: Optional[bool] = None
    status: Optional[ProductStatus] = None


class ProductOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    shop_id: str
    seller_id: str
    category_id: Optional[str] = None
    name: str
    slug: str
    description: str
    price: Decimal
    old_price: Optional[Decimal] = None
    images: List[str] = []
    tags: List[str] = []
    materials: List[str] = []
    colors: List[str] = []
    sizes: List[str] = []
    delivery_methods: List[str] = []
    rating: Decimal
    review_count: int
    sales_count: int
    in_stock: bool
    stock_count: int
    production_days: int
    is_digital: bool
    is_customizable: bool
    weight: Optional[int] = None
    city: Optional[str] = None
    status: ProductStatus
    is_featured: bool
    created_at: datetime
