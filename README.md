# Open Shelf

This project provides a minimal full-stack application skeleton. The Python back end uses [FastAPI](https://fastapi.tiangolo.com/) and SQLAlchemy. A React front end lives in `client/` but is not yet implemented.

## Development Setup

1. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server**

   ```bash
   uvicorn server.main:app --reload
   ```

   The API will be available at `http://localhost:8000/`.

### Configuration

Environment variables can be placed in a `.env` file at the project root. The main setting is `DATABASE_URL`, which defaults to a local SQLite database (`sqlite:///./dev.db`).

### Running tests

```bash
PYTHONPATH=. pytest
```
