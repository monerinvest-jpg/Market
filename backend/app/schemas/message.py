from datetime import datetime
from pydantic import BaseModel


class MessageCreate(BaseModel):
    to_id: str
    text: str


class MessageOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    from_id: str
    to_id: str
    text: str
    is_read: bool
    created_at: datetime
