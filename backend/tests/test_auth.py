import pytest

USER_DATA = {
    "name": "Тест Юзер",
    "email": "testuser@example.com",
    "password": "testpass123",
    "role": "buyer",
}


@pytest.mark.asyncio
async def test_register(client):
    response = await client.post("/api/v1/auth/register", json=USER_DATA)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == USER_DATA["email"]


@pytest.mark.asyncio
async def test_login(client):
    # First register
    await client.post("/api/v1/auth/register", json={**USER_DATA, "email": "login_test@example.com"})
    # Then login
    response = await client.post("/api/v1/auth/login", json={
        "email": "login_test@example.com",
        "password": USER_DATA["password"],
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


@pytest.mark.asyncio
async def test_login_wrong_password(client):
    response = await client.post("/api/v1/auth/login", json={
        "email": USER_DATA["email"],
        "password": "wrongpassword",
    })
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_get_me(client):
    # Register and get token
    reg = await client.post("/api/v1/auth/register", json={**USER_DATA, "email": "me_test@example.com"})
    token = reg.json()["access_token"]
    response = await client.get("/api/v1/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "me_test@example.com"


@pytest.mark.asyncio
async def test_duplicate_email(client):
    data = {**USER_DATA, "email": "duplicate@example.com"}
    await client.post("/api/v1/auth/register", json=data)
    response = await client.post("/api/v1/auth/register", json=data)
    assert response.status_code == 409
