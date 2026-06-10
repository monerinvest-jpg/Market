from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.category import Category
from app.utils.auth import require_role

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=List[dict])
async def get_categories(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Category).order_by(Category.sort_order))
    cats = result.scalars().all()
    # Build tree
    cat_map = {c.id: {
        "id": c.id, "name": c.name, "slug": c.slug,
        "icon": c.icon, "product_count": c.product_count,
        "parent_id": c.parent_id, "children": []
    } for c in cats}
    roots = []
    for c in cat_map.values():
        if c["parent_id"]:
            parent = cat_map.get(c["parent_id"])
            if parent:
                parent["children"].append(c)
        else:
            roots.append(c)
    return roots


@router.post("/", response_model=dict, status_code=201)
async def create_category(
    name: str, slug: str, icon: str = None, parent_id: str = None,
    _=Depends(require_role("admin")),
    db: AsyncSession = Depends(get_db),
):
    import uuid
    cat = Category(id=str(uuid.uuid4()), name=name, slug=slug, icon=icon, parent_id=parent_id)
    db.add(cat)
    await db.flush()
    await db.refresh(cat)
    return {"id": cat.id, "name": cat.name, "slug": cat.slug}
