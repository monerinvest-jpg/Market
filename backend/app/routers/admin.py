from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User, UserRole
from app.models.product import Product, ProductStatus
from app.models.shop import Shop, ShopStatus
from app.models.order import Order, OrderStatus
from app.utils.auth import require_role

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/stats")
async def get_stats(
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    async def count(stmt):
        return (await db.execute(stmt)).scalar_one()

    total_users    = await count(select(func.count(User.id)).where(User.role == UserRole.buyer))
    total_sellers  = await count(select(func.count(User.id)).where(User.role == UserRole.seller))
    total_products = await count(select(func.count(Product.id)).where(Product.status == ProductStatus.active))
    total_shops    = await count(select(func.count(Shop.id)).where(Shop.status == ShopStatus.active))
    total_orders   = await count(select(func.count(Order.id)))
    new_orders     = await count(select(func.count(Order.id)).where(Order.status.in_([OrderStatus.new, OrderStatus.paid])))
    pending_products = await count(select(func.count(Product.id)).where(Product.status == ProductStatus.pending))

    revenue_result = await db.execute(
        select(func.sum(Order.total_amount)).where(
            Order.status.in_([OrderStatus.paid, OrderStatus.shipped, OrderStatus.delivered, OrderStatus.completed])
        )
    )
    total_revenue = float(revenue_result.scalar_one() or 0)

    return {
        "total_users": total_users,
        "total_sellers": total_sellers,
        "total_products": total_products,
        "total_shops": total_shops,
        "total_orders": total_orders,
        "new_orders": new_orders,
        "pending_products": pending_products,
        "total_revenue": total_revenue,
    }


@router.get("/stats/revenue")
async def get_revenue_chart(
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    """Revenue aggregated by month (last 12 months)."""
    result = await db.execute(
        select(
            func.date_format(Order.created_at, "%Y-%m").label("month"),
            func.sum(Order.total_amount).label("revenue"),
            func.count(Order.id).label("orders"),
        )
        .where(Order.status.in_([OrderStatus.paid, OrderStatus.shipped,
                                   OrderStatus.delivered, OrderStatus.completed]))
        .group_by("month")
        .order_by("month")
        .limit(12)
    )
    rows = result.all()
    return [{"month": r.month, "revenue": float(r.revenue), "orders": r.orders} for r in rows]
