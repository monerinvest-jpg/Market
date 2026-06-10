from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.utils.auth import hash_password, verify_password
from app.schemas.user import UserCreate, UserUpdate
from app.crud.base import CRUDBase
import uuid


class CRUDUser(CRUDBase[User]):
    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def authenticate(self, db: AsyncSession, email: str, password: str) -> Optional[User]:
        user = await self.get_by_email(db, email)
        if not user or not verify_password(password, user.password_hash):
            return None
        return user

    async def create_user(self, db: AsyncSession, data: UserCreate) -> User:
        user = User(
            id=str(uuid.uuid4()),
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
            role=data.role,
            city=data.city,
            phone=data.phone,
            bonus_balance=100,
            referral_code=str(uuid.uuid4())[:8].upper(),
        )
        db.add(user)
        await db.flush()
        await db.refresh(user)
        return user

    async def update_user(self, db: AsyncSession, user: User, data: UserUpdate) -> User:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(user, field, value)
        await db.flush()
        await db.refresh(user)
        return user

    async def toggle_block(self, db: AsyncSession, user: User) -> User:
        user.is_blocked = not user.is_blocked
        await db.flush()
        await db.refresh(user)
        return user


crud_user = CRUDUser(User)
