from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.favorite import crud_favorite
from app.utils.auth import require_role

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get("/")
async def get_favorites(
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    favorites = await crud_favorite.get_user_favorites(db, current_user.id)
    return [
        {
            "id": fav.id,
            "product_id": fav.product_id,
            "product": {
                "id": fav.product.id,
                "name": fav.product.name,
                "price": float(fav.product.price),
                "images": fav.product.images,
                "rating": float(fav.product.rating),
            } if fav.product else None,
            "created_at": fav.created_at,
        }
        for fav in favorites
    ]


@router.post("/{product_id}")
async def toggle_favorite(
    product_id: str,
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    added = await crud_favorite.toggle(db, current_user.id, product_id)
    return {"added": added, "product_id": product_id}


@router.delete("/{product_id}", status_code=204)
async def remove_favorite(
    product_id: str,
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select
    from app.models.favorite import Favorite
    result = await db.execute(
        select(Favorite).where(Favorite.user_id == current_user.id, Favorite.product_id == product_id)
    )
    fav = result.scalar_one_or_none()
    if fav:
        await db.delete(fav)
