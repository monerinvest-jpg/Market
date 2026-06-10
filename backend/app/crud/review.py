from typing import List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.review import Review
from app.schemas.review import ReviewCreate
from app.crud.base import CRUDBase
import uuid


class CRUDReview(CRUDBase[Review]):
    async def get_by_product(self, db: AsyncSession, product_id: str) -> List[Review]:
        result = await db.execute(
            select(Review).where(Review.product_id == product_id).order_by(Review.created_at.desc())
        )
        return result.scalars().all()

    async def get_by_shop(self, db: AsyncSession, shop_id: str) -> List[Review]:
        result = await db.execute(
            select(Review).where(Review.shop_id == shop_id).order_by(Review.created_at.desc())
        )
        return result.scalars().all()

    async def create_review(self, db: AsyncSession, data: ReviewCreate, user_id: str) -> Review:
        review = Review(id=str(uuid.uuid4()), user_id=user_id, **data.model_dump())
        db.add(review)
        await db.flush()
        await db.refresh(review)
        return review


crud_review = CRUDReview(Review)
