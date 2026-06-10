from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.review import crud_review
from app.schemas.review import ReviewCreate, ReviewOut, SellerReplyRequest
from app.utils.auth import get_current_user, require_role

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/product/{product_id}", response_model=List[ReviewOut])
async def get_product_reviews(product_id: str, db: AsyncSession = Depends(get_db)):
    return await crud_review.get_by_product(db, product_id)


@router.get("/shop/{shop_id}", response_model=List[ReviewOut])
async def get_shop_reviews(shop_id: str, db: AsyncSession = Depends(get_db)):
    return await crud_review.get_by_shop(db, shop_id)


@router.post("/", response_model=ReviewOut, status_code=201)
async def create_review(
    data: ReviewCreate,
    current_user=Depends(require_role("buyer")),
    db: AsyncSession = Depends(get_db),
):
    return await crud_review.create_review(db, data, user_id=current_user.id)


@router.patch("/{review_id}/reply")
async def seller_reply(
    review_id: str,
    data: SellerReplyRequest,
    current_user=Depends(require_role("seller")),
    db: AsyncSession = Depends(get_db),
):
    review = await crud_review.get(db, review_id)
    if not review:
        raise HTTPException(404, "Отзыв не найден")
    review.seller_reply = data.reply
    await db.flush()
    return {"ok": True}


@router.delete("/{review_id}", status_code=204)
async def delete_review(
    review_id: str,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    deleted = await crud_review.delete(db, id=review_id)
    if not deleted:
        raise HTTPException(404, "Отзыв не найден")
