from fastapi.testclient import TestClient

from server.main import app

client = TestClient(app)

def test_root():
    response = client.get('/')
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Open Shelf API"}
