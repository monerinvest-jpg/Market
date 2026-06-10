from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.product import crud_product
from app.crud.shop import crud_shop
from app.schemas.product import ProductCreate, ProductUpdate, ProductOut
from app.schemas.common import PaginatedResponse
from app.utils.auth import get_current_user, require_role

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=PaginatedResponse)
async def list_products(
    q: Optional[str] = Query(None),
    category_id: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    in_stock: Optional[bool] = Query(None),
    sort: str = Query("popular"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    products, total = await crud_product.get_products(
        db, q=q, category_id=category_id,
        min_price=min_price, max_price=max_price,
        in_stock=in_stock, sort=sort,
        offset=(page - 1) * limit, limit=limit,
    )
    return {
        "items": products, "total": total,
        "page": page, "pages": max(1, (total + limit - 1) // limit)
    }


@router.get("/featured", response_model=list)
async def featured_products(db: AsyncSession = Depends(get_db)):
    return await crud_product.get_featured(db)


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    product = await crud_product.get_by_id(db, product_id)
    if not product:
        raise HTTPException(404, "Товар не найден")
    return product


@router.post("/", response_model=ProductOut, status_code=201)
async def create_product(
    data: ProductCreate,
    current_user=Depends(require_role("seller", "admin")),
    db: AsyncSession = Depends(get_db),
):
    shop = await crud_shop.get_by_seller(db, current_user.id)
    if not shop:
        raise HTTPException(400, "У вас нет магазина. Создайте магазин сначала.")
    return await crud_product.create(db, data, seller_id=current_user.id, shop_id=shop.id)


@router.put("/{product_id}", response_model=ProductOut)
async def update_product(
    product_id: str,
    data: ProductUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product = await crud_product.get_by_id(db, product_id)
    if not product:
        raise HTTPException(404, "Товар не найден")
    if product.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(403, "Нет доступа")
    return await crud_product.update(db, product, data)


@router.delete("/{product_id}", status_code=204)
async def delete_product(
    product_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    product = await crud_product.get_by_id(db, product_id)
    if not product:
        raise HTTPException(404, "Товар не найден")
    if product.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(403, "Нет доступа")
    await crud_product.delete(db, id=product_id)


@router.patch("/{product_id}/approve")
async def approve_product(
    product_id: str,
    action: str = Query(...),
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    status = "active" if action == "approve" else "rejected"
    await crud_product.set_status(db, product_id, status)
    return {"ok": True, "status": status}
