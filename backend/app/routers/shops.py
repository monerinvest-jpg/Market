from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.shop import crud_shop
from app.schemas.shop import ShopCreate, ShopUpdate, ShopOut
from app.utils.auth import get_current_user, require_role

router = APIRouter(prefix="/shops", tags=["Shops"])


@router.get("/", response_model=list)
async def list_shops(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)):
    return await crud_shop.get_all(db, skip=skip, limit=limit)


@router.get("/my", response_model=ShopOut)
async def my_shop(current_user=Depends(require_role("seller")), db: AsyncSession = Depends(get_db)):
    shop = await crud_shop.get_by_seller(db, current_user.id)
    if not shop:
        raise HTTPException(404, "Магазин не найден")
    return shop


@router.get("/{shop_id}", response_model=ShopOut)
async def get_shop(shop_id: str, db: AsyncSession = Depends(get_db)):
    shop = await crud_shop.get(db, shop_id)
    if not shop:
        raise HTTPException(404, "Магазин не найден")
    return shop


@router.post("/", response_model=ShopOut, status_code=201)
async def create_shop(
    data: ShopCreate,
    current_user=Depends(require_role("seller")),
    db: AsyncSession = Depends(get_db),
):
    existing = await crud_shop.get_by_seller(db, current_user.id)
    if existing:
        raise HTTPException(409, "У вас уже есть магазин")
    return await crud_shop.create_shop(db, data, seller_id=current_user.id)


@router.put("/{shop_id}", response_model=ShopOut)
async def update_shop(
    shop_id: str,
    data: ShopUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    shop = await crud_shop.get(db, shop_id)
    if not shop:
        raise HTTPException(404, "Магазин не найден")
    if shop.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(403, "Нет доступа")
    return await crud_shop.update_shop(db, shop, data)
