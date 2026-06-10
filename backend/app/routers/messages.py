from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageOut
from app.utils.auth import get_current_user
import uuid
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["Messages"])


@router.get("/", response_model=List[MessageOut])
async def get_my_messages(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Message)
        .where(or_(Message.from_id == current_user.id, Message.to_id == current_user.id))
        .order_by(Message.created_at.desc())
    )
    return result.scalars().all()


@router.post("/", response_model=MessageOut, status_code=201)
async def send_message(
    data: MessageCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    msg = Message(
        id=str(uuid.uuid4()),
        from_id=current_user.id,
        to_id=data.to_id,
        text=data.text,
    )
    db.add(msg)
    await db.flush()
    await db.refresh(msg)
    return msg


@router.patch("/{message_id}/read")
async def mark_read(
    message_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    msg = await db.get(Message, message_id)
    if not msg or msg.to_id != current_user.id:
        raise HTTPException(404, "Сообщение не найдено")
    msg.is_read = True
    await db.flush()
    return {"ok": True}
