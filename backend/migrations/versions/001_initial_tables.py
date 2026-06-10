"""Initial tables

Revision ID: 001
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa


revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('email', sa.String(255), unique=True, nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('role', sa.Enum('admin','seller','buyer'), nullable=False, server_default='buyer'),
        sa.Column('phone', sa.String(20)),
        sa.Column('city', sa.String(100)),
        sa.Column('avatar', sa.String(500)),
        sa.Column('bio', sa.String(500)),
        sa.Column('bonus_balance', sa.Integer, default=0),
        sa.Column('referral_code', sa.String(20), unique=True),
        sa.Column('is_blocked', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now()),
    )

    op.create_table('categories',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('parent_id', sa.String(36), sa.ForeignKey('categories.id'), nullable=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('slug', sa.String(100), unique=True, nullable=False),
        sa.Column('icon', sa.String(20)),
        sa.Column('product_count', sa.Integer, default=0),
        sa.Column('sort_order', sa.Integer, default=0),
    )

    op.create_table('shops',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('seller_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), unique=True, nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('slug', sa.String(200), unique=True, nullable=False),
        sa.Column('description', sa.Text),
        sa.Column('logo', sa.String(500)),
        sa.Column('banner', sa.String(500)),
        sa.Column('city', sa.String(100)),
        sa.Column('rating', sa.Numeric(3,2), default=0),
        sa.Column('review_count', sa.Integer, default=0),
        sa.Column('sales_count', sa.Integer, default=0),
        sa.Column('response_time', sa.String(50)),
        sa.Column('status', sa.Enum('active','pending','blocked'), server_default='active'),
        sa.Column('delivery_conditions', sa.Text),
        sa.Column('return_conditions', sa.Text),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table('products',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('shop_id', sa.String(36), sa.ForeignKey('shops.id', ondelete='CASCADE'), nullable=False),
        sa.Column('seller_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('category_id', sa.String(36), sa.ForeignKey('categories.id')),
        sa.Column('name', sa.String(300), nullable=False),
        sa.Column('slug', sa.String(300), unique=True, nullable=False),
        sa.Column('description', sa.Text, nullable=False),
        sa.Column('price', sa.Numeric(10,2), nullable=False),
        sa.Column('old_price', sa.Numeric(10,2)),
        sa.Column('images', sa.JSON),
        sa.Column('tags', sa.JSON),
        sa.Column('materials', sa.JSON),
        sa.Column('colors', sa.JSON),
        sa.Column('sizes', sa.JSON),
        sa.Column('delivery_methods', sa.JSON),
        sa.Column('rating', sa.Numeric(3,2), default=0),
        sa.Column('review_count', sa.Integer, default=0),
        sa.Column('sales_count', sa.Integer, default=0),
        sa.Column('in_stock', sa.Boolean, default=True),
        sa.Column('stock_count', sa.Integer, default=0),
        sa.Column('production_days', sa.Integer, default=1),
        sa.Column('is_digital', sa.Boolean, default=False),
        sa.Column('is_customizable', sa.Boolean, default=False),
        sa.Column('weight', sa.Integer),
        sa.Column('city', sa.String(100)),
        sa.Column('status', sa.Enum('active','pending','rejected'), server_default='pending'),
        sa.Column('is_featured', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table('promo_codes',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('code', sa.String(50), unique=True, nullable=False),
        sa.Column('type', sa.Enum('percent','fixed','free_delivery'), nullable=False),
        sa.Column('value', sa.Numeric(10,2), default=0),
        sa.Column('min_order_amount', sa.Numeric(10,2), default=0),
        sa.Column('usage_limit', sa.Integer, default=0),
        sa.Column('usage_count', sa.Integer, default=0),
        sa.Column('expires_at', sa.Date),
        sa.Column('is_active', sa.Boolean, default=True),
    )

    op.create_table('orders',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('promo_id', sa.String(36), sa.ForeignKey('promo_codes.id')),
        sa.Column('status', sa.Enum('new','paid','shipped','delivered','completed','cancelled'), server_default='new'),
        sa.Column('total_amount', sa.Numeric(10,2), nullable=False),
        sa.Column('delivery_amount', sa.Numeric(10,2), default=0),
        sa.Column('discount_amount', sa.Numeric(10,2), default=0),
        sa.Column('delivery_address', sa.Text),
        sa.Column('delivery_method', sa.String(100)),
        sa.Column('payment_method', sa.String(100)),
        sa.Column('track_number', sa.String(100)),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table('order_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('order_id', sa.String(36), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id'), nullable=False),
        sa.Column('shop_id', sa.String(36), sa.ForeignKey('shops.id'), nullable=False),
        sa.Column('product_name', sa.String(300), nullable=False),
        sa.Column('product_image', sa.String(500)),
        sa.Column('shop_name', sa.String(200)),
        sa.Column('price', sa.Numeric(10,2), nullable=False),
        sa.Column('quantity', sa.Integer, default=1),
        sa.Column('variant', sa.String(200)),
    )

    op.create_table('reviews',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('shop_id', sa.String(36), sa.ForeignKey('shops.id', ondelete='CASCADE'), nullable=False),
        sa.Column('rating', sa.Integer, nullable=False),
        sa.Column('text', sa.Text),
        sa.Column('quality_rating', sa.Integer),
        sa.Column('delivery_rating', sa.Integer),
        sa.Column('communication_rating', sa.Integer),
        sa.Column('seller_reply', sa.Text),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table('cart_items',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('quantity', sa.Integer, default=1),
        sa.Column('variant', sa.String(200), default=''),
        sa.UniqueConstraint('user_id', 'product_id', 'variant', name='uq_cart_item'),
    )

    op.create_table('favorites',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('user_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.String(36), sa.ForeignKey('products.id', ondelete='CASCADE'), nullable=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
        sa.UniqueConstraint('user_id', 'product_id', name='uq_favorite'),
    )

    op.create_table('messages',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('from_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('to_id', sa.String(36), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('text', sa.Text, nullable=False),
        sa.Column('is_read', sa.Boolean, default=False),
        sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    )

    # Indexes
    op.create_index('ix_products_status', 'products', ['status'])
    op.create_index('ix_products_category', 'products', ['category_id'])
    op.create_index('ix_orders_user', 'orders', ['user_id'])
    op.create_index('ix_reviews_product', 'reviews', ['product_id'])


def downgrade() -> None:
    op.drop_table('messages')
    op.drop_table('favorites')
    op.drop_table('cart_items')
    op.drop_table('reviews')
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('promo_codes')
    op.drop_table('products')
    op.drop_table('shops')
    op.drop_table('categories')
    op.drop_table('users')
