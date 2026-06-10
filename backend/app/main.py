"""
HandMade Market — FastAPI Application Entry Point
"""
import logging
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import init_db
from app.middleware import LoggingMiddleware
from app.utils.exceptions import register_exception_handlers
from app.routers import (
    auth, users, products, shops, orders,
    categories, reviews, cart, favorites,
    promo_codes, messages, admin,
)

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown events."""
    logger.info("Starting HandMade Market API...")
    await init_db()
    logger.info("Database initialized.")
    yield
    logger.info("Shutting down...")


app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    description=(
        "REST API backend for HandMade Market — a marketplace for "
        "handmade goods. Built with FastAPI + MySQL + JWT."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ─────────────────────────────────────────────────
origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Custom Middleware ─────────────────────────────────────
app.add_middleware(LoggingMiddleware)

# ── Exception Handlers ────────────────────────────────────
register_exception_handlers(app)

# ── Routers ──────────────────────────────────────────────
PREFIX = "/api/v1"

app.include_router(auth.router,         prefix=PREFIX)
app.include_router(users.router,        prefix=PREFIX)
app.include_router(products.router,     prefix=PREFIX)
app.include_router(shops.router,        prefix=PREFIX)
app.include_router(orders.router,       prefix=PREFIX)
app.include_router(categories.router,   prefix=PREFIX)
app.include_router(reviews.router,      prefix=PREFIX)
app.include_router(cart.router,         prefix=PREFIX)
app.include_router(favorites.router,    prefix=PREFIX)
app.include_router(promo_codes.router,  prefix=PREFIX)
app.include_router(messages.router,     prefix=PREFIX)
app.include_router(admin.router,        prefix=PREFIX)


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "HandMade Market API",
        "version": settings.APP_VERSION,
        "status": "ok",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "timestamp": time.time()}
