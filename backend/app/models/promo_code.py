import enum
import uuid
from sqlalchemy import Boolean, Column, Date, Enum, Integer, Numeric, String
from app.database import Base


class PromoType(str, enum.Enum):
    percent       = "percent"
    fixed         = "fixed"
    free_delivery = "free_delivery"


class PromoCode(Base):
    __tablename__ = "promo_codes"

    id               = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code             = Column(String(50), unique=True, nullable=False, index=True)
    type             = Column(Enum(PromoType), nullable=False)
    value            = Column(Numeric(10, 2), default=0)
    min_order_amount = Column(Numeric(10, 2), default=0)
    usage_limit      = Column(Integer, default=0)
    usage_count      = Column(Integer, default=0)
    expires_at       = Column(Date)
    is_active        = Column(Boolean, default=True)
