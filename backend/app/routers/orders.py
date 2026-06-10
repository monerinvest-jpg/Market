from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.order import crud_order
from app.crud.cart import crud_cart
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.utils.auth import get_current_user, require_role

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=List[OrderOut])
async def my_orders(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await crud_order.get_user_orders(db, current_user.id)


@router.get("/{order_id}", response_model=OrderOut)
async def get_order(
    order_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await crud_order.get_by_id_with_items(db, order_id)
    if not order:
        raise HTTPException(404, "Заказ не найден")
    if order.user_id != current_user.id and current_user.role not in ("admin", "seller"):
        raise HTTPException(403, "Нет доступа")
    return order


@router.post("/", response_model=OrderOut, status_code=201)
async def create_order(
    data: OrderCreate,
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    order = await crud_order.create_order(db, data, user_id=current_user.id)
    # Clear cart after order
    await crud_cart.clear_cart(db, current_user.id)
    return order


@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(
    order_id: str,
    data: OrderStatusUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    order = await crud_order.get_by_id_with_items(db, order_id)
    if not order:
        raise HTTPException(404, "Заказ не найден")
    if current_user.role not in ("admin", "seller"):
        raise HTTPException(403, "Нет доступа")
    return await crud_order.update_status(db, order, data)
