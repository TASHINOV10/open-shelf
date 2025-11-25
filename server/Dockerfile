# server/Dockerfile

FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into a "server" package directory
COPY server/ /app/server

EXPOSE 8000

ENV PYTHONUNBUFFERED=1

# Run FastAPI as "server.main:app" so that relative imports (from .config) work
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8000"]
