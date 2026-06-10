from typing import List
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import date

from app.database import get_db
from app.crud.promo import crud_promo
from app.schemas.promo import PromoCreate, PromoValidateRequest, PromoOut
from app.utils.auth import get_current_user, require_role

router = APIRouter(prefix="/promo-codes", tags=["Promo Codes"])


@router.post("/validate")
async def validate_promo(
    data: PromoValidateRequest,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    promo = await crud_promo.get_by_code(db, data.code)
    if not promo:
        raise HTTPException(404, "Промокод не найден или недействителен")
    if promo.expires_at and promo.expires_at < date.today():
        raise HTTPException(400, "Промокод истёк")
    if promo.usage_limit and promo.usage_count >= promo.usage_limit:
        raise HTTPException(400, "Лимит использования промокода исчерпан")
    if data.order_amount < promo.min_order_amount:
        raise HTTPException(400, f"Минимальная сумма заказа: {promo.min_order_amount} ₽")

    discount = Decimal(0)
    if promo.type == "percent":
        discount = data.order_amount * promo.value / 100
    elif promo.type == "fixed":
        discount = min(promo.value, data.order_amount)

    return {"valid": True, "promo": promo, "discount": float(discount)}


@router.get("/", response_model=List[PromoOut])
async def list_promos(
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    return await crud_promo.get_all(db)


@router.post("/", response_model=PromoOut, status_code=201)
async def create_promo(
    data: PromoCreate,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    return await crud_promo.create_promo(db, data)


@router.patch("/{promo_id}/toggle")
async def toggle_promo(
    promo_id: str,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    promo = await crud_promo.get(db, promo_id)
    if not promo:
        raise HTTPException(404, "Промокод не найден")
    await crud_promo.toggle(db, promo)
    return {"is_active": promo.is_active}


@router.delete("/{promo_id}", status_code=204)
async def delete_promo(
    promo_id: str,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    deleted = await crud_promo.delete(db, id=promo_id)
    if not deleted:
        raise HTTPException(404, "Промокод не найден")
