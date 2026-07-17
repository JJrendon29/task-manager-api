def get_auth_token(client):
    client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "password123"
    })
    response = client.post("/auth/login", data={
        "username": "test@example.com",
        "password": "password123"
    })
    return response.json()["access_token"]


def test_create_task(client):
    token = get_auth_token(client)
    response = client.post("/tasks/",
        json={"title": "Tarea de prueba"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Tarea de prueba"
    assert data["status"] == "pending"


def test_get_tasks_empty(client):
    token = get_auth_token(client)
    response = client.get("/tasks/",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json() == []


def test_get_tasks_requires_auth(client):
    response = client.get("/tasks/")
    assert response.status_code == 401


def test_update_task_status(client):
    token = get_auth_token(client)
    create_response = client.post("/tasks/",
        json={"title": "Tarea de prueba"},
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = create_response.json()["id"]

    response = client.patch(f"/tasks/{task_id}",
        json={"status": "done"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "done"


def test_delete_task(client):
    token = get_auth_token(client)
    create_response = client.post("/tasks/",
        json={"title": "Tarea a borrar"},
        headers={"Authorization": f"Bearer {token}"}
    )
    task_id = create_response.json()["id"]

    response = client.delete(f"/tasks/{task_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 204
