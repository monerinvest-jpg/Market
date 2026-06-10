from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.cart import crud_cart
from app.schemas.cart import CartItemCreate, CartItemUpdate, CartItemOut
from app.utils.auth import require_role

router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("/")
async def get_cart(
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    items = await crud_cart.get_user_cart(db, current_user.id)
    total = sum(
        (item.product.price * item.quantity) for item in items if item.product
    )
    return {
        "items": [
            {
                "id": item.id,
                "product_id": item.product_id,
                "quantity": item.quantity,
                "variant": item.variant,
                "product": {
                    "name": item.product.name if item.product else None,
                    "price": float(item.product.price) if item.product else 0,
                    "images": item.product.images if item.product else [],
                    "in_stock": item.product.in_stock if item.product else False,
                },
            }
            for item in items
        ],
        "total": float(total),
    }


@router.post("/items", status_code=201)
async def add_to_cart(
    data: CartItemCreate,
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    item = await crud_cart.add_item(db, current_user.id, data)
    return {"id": item.id, "product_id": item.product_id, "quantity": item.quantity}


@router.put("/items/{item_id}")
async def update_cart_item(
    item_id: str,
    data: CartItemUpdate,
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    item = await crud_cart.get(db, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(404, "Позиция корзины не найдена")
    if data.quantity <= 0:
        await crud_cart.delete(db, id=item_id)
        return {"ok": True, "deleted": True}
    item.quantity = data.quantity
    await db.flush()
    return {"id": item.id, "quantity": item.quantity}


@router.delete("/items/{item_id}", status_code=204)
async def remove_cart_item(
    item_id: str,
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    item = await crud_cart.get(db, item_id)
    if not item or item.user_id != current_user.id:
        raise HTTPException(404, "Позиция корзины не найдена")
    await crud_cart.delete(db, id=item_id)


@router.delete("/", status_code=204)
async def clear_cart(
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    await crud_cart.clear_cart(db, current_user.id)
