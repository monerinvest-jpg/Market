from typing import List, Optional
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.order import Order, OrderItem, OrderStatus
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderStatusUpdate
from app.crud.base import CRUDBase
import uuid


class CRUDOrder(CRUDBase[Order]):
    async def get_user_orders(self, db: AsyncSession, user_id: str) -> List[Order]:
        result = await db.execute(
            select(Order)
            .where(Order.user_id == user_id)
            .options(selectinload(Order.items))
            .order_by(Order.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_id_with_items(self, db: AsyncSession, order_id: str) -> Optional[Order]:
        result = await db.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(selectinload(Order.items))
        )
        return result.scalar_one_or_none()

    async def create_order(self, db: AsyncSession, data: OrderCreate, user_id: str) -> Order:
        order_id = str(uuid.uuid4())
        total = Decimal(0)
        order_items = []

        for item_data in data.items:
            product = await db.get(Product, item_data.product_id)
            if not product:
                continue
            item_total = product.price * item_data.quantity
            total += item_total
            order_items.append(OrderItem(
                id=str(uuid.uuid4()),
                order_id=order_id,
                product_id=product.id,
                shop_id=product.shop_id,
                product_name=product.name,
                product_image=product.images[0] if product.images else None,
                shop_name=None,
                price=product.price,
                quantity=item_data.quantity,
                variant=item_data.variant,
            ))

        order = Order(
            id=order_id,
            user_id=user_id,
            total_amount=total,
            delivery_amount=Decimal("350"),
            discount_amount=Decimal(0),
            delivery_address=data.delivery_address,
            delivery_method=data.delivery_method,
            payment_method=data.payment_method,
        )
        db.add(order)
        for item in order_items:
            db.add(item)
        await db.flush()
        return order

    async def update_status(self, db: AsyncSession, order: Order, data: OrderStatusUpdate) -> Order:
        order.status = data.status
        if data.track_number:
            order.track_number = data.track_number
        await db.flush()
        await db.refresh(order)
        return order


crud_order = CRUDOrder(Order)
