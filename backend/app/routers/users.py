from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.crud.user import crud_user
from app.schemas.user import UserOut, UserPublic, UserUpdate
from app.utils.auth import get_current_user, require_role

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
async def get_me(current_user=Depends(get_current_user)):
    return current_user


@router.put("/me", response_model=UserOut)
async def update_me(
    data: UserUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return await crud_user.update_user(db, current_user, data)


@router.get("/{user_id}", response_model=UserPublic)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get(db, user_id)
    if not user:
        raise HTTPException(404, "Пользователь не найден")
    return user


@router.get("/", response_model=List[UserOut])
async def list_users(
    skip: int = 0,
    limit: int = 50,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    return await crud_user.get_all(db, skip=skip, limit=limit)


@router.patch("/{user_id}/block")
async def toggle_block(
    user_id: str,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    user = await crud_user.get(db, user_id)
    if not user:
        raise HTTPException(404, "Пользователь не найден")
    await crud_user.toggle_block(db, user)
    return {"is_blocked": user.is_blocked}


@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: str,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    deleted = await crud_user.delete(db, id=user_id)
    if not deleted:
        raise HTTPException(404, "Пользователь не найден")
