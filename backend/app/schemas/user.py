from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator

from app.models.user import UserRole


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.buyer


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.buyer
    city: Optional[str] = None
    phone: Optional[str] = None
    referral_code: Optional[str] = None


class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None


class UserOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    email: str
    role: UserRole
    phone: Optional[str] = None
    city: Optional[str] = None
    avatar: Optional[str] = None
    bio: Optional[str] = None
    bonus_balance: int
    referral_code: Optional[str] = None
    is_blocked: bool
    created_at: datetime


class UserPublic(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    role: UserRole
    city: Optional[str] = None
    avatar: Optional[str] = None
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserOut


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str
