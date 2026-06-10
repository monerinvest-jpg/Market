from typing import List, Optional, Tuple
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.product import Product, ProductStatus
from app.schemas.product import ProductCreate, ProductUpdate
from app.crud.base import CRUDBase
import uuid, re


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-zа-яё0-9\s-]', '', text)
    text = re.sub(r'[\s]+', '-', text.strip())
    return text + '-' + str(uuid.uuid4())[:8]


class CRUDProduct(CRUDBase[Product]):
    async def get_products(
        self, db: AsyncSession, *,
        q: Optional[str] = None,
        category_id: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        in_stock: Optional[bool] = None,
        sort: str = "popular",
        offset: int = 0,
        limit: int = 20,
        status: ProductStatus = ProductStatus.active,
        shop_id: Optional[str] = None,
    ) -> Tuple[List[Product], int]:
        stmt = select(Product).where(Product.status == status)

        if q:
            stmt = stmt.where(or_(
                Product.name.ilike(f"%{q}%"),
                Product.description.ilike(f"%{q}%"),
            ))
        if category_id:
            stmt = stmt.where(Product.category_id == category_id)
        if min_price is not None:
            stmt = stmt.where(Product.price >= min_price)
        if max_price is not None:
            stmt = stmt.where(Product.price <= max_price)
        if in_stock is not None:
            stmt = stmt.where(Product.in_stock == in_stock)
        if shop_id:
            stmt = stmt.where(Product.shop_id == shop_id)

        sort_map = {
            "popular":    Product.sales_count.desc(),
            "new":        Product.created_at.desc(),
            "price_asc":  Product.price.asc(),
            "price_desc": Product.price.desc(),
            "rating":     Product.rating.desc(),
        }
        stmt = stmt.order_by(sort_map.get(sort, Product.sales_count.desc()))

        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await db.execute(count_stmt)).scalar_one()

        result = await db.execute(stmt.offset(offset).limit(limit))
        return result.scalars().all(), total

    async def get_featured(self, db: AsyncSession, limit: int = 12) -> List[Product]:
        result = await db.execute(
            select(Product)
            .where(Product.is_featured == True, Product.status == ProductStatus.active)
            .limit(limit)
        )
        return result.scalars().all()

    async def get_by_id(self, db: AsyncSession, product_id: str) -> Optional[Product]:
        return await db.get(Product, product_id)

    async def create(self, db: AsyncSession, data: ProductCreate, seller_id: str, shop_id: str) -> Product:
        product = Product(
            id=str(uuid.uuid4()),
            shop_id=shop_id,
            seller_id=seller_id,
            slug=slugify(data.name),
            **data.model_dump(),
        )
        db.add(product)
        await db.flush()
        await db.refresh(product)
        return product

    async def update(self, db: AsyncSession, product: Product, data: ProductUpdate) -> Product:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(product, field, value)
        await db.flush()
        await db.refresh(product)
        return product

    async def set_status(self, db: AsyncSession, product_id: str, status: str) -> None:
        product = await self.get_by_id(db, product_id)
        if product:
            product.status = status
            await db.flush()


crud_product = CRUDProduct(Product)
