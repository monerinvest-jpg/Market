import pytest

SELLER_DATA = {
    "name": "Продавец Тест",
    "email": "seller_prod_test@example.com",
    "password": "sellerpass",
    "role": "seller",
}

PRODUCT_DATA = {
    "name": "Тестовый товар",
    "description": "Описание тестового товара для проверки API",
    "price": 1500.00,
    "images": ["https://example.com/img.jpg"],
    "tags": ["тест", "товар"],
    "in_stock": True,
    "stock_count": 10,
    "production_days": 3,
    "is_digital": False,
    "is_customizable": False,
}


@pytest.mark.asyncio
async def test_list_products_public(client):
    response = await client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_featured_products(client):
    response = await client.get("/api/v1/products/featured")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_get_categories(client):
    response = await client.get("/api/v1/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


@pytest.mark.asyncio
async def test_create_product_requires_auth(client):
    response = await client.post("/api/v1/products", json=PRODUCT_DATA)
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_product_not_found(client):
    response = await client.get("/api/v1/products/nonexistent-id-12345")
    assert response.status_code == 404
