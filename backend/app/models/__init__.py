# Import all models so SQLAlchemy Base.metadata is populated
from app.models.user import User
from app.models.shop import Shop
from app.models.category import Category
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.models.review import Review
from app.models.cart import CartItem
from app.models.favorite import Favorite
from app.models.message import Message
from app.models.promo_code import PromoCode

__all__ = [
    "User", "Shop", "Category", "Product",
    "Order", "OrderItem", "Review", "CartItem",
    "Favorite", "Message", "PromoCode",
]
