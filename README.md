# PulseWatch

PulseWatch is a small FastAPI app for monitoring website uptime and tracking user-owned monitoring targets. It includes authentication, monitor registration, and a Celery-based URL checking task flow.

## Features

- User signup and login with JWT-based auth
- Protected monitor creation and listing endpoints
- Async SQLAlchemy database access with PostgreSQL
- Alembic migrations for schema changes
- Redis + Celery task runner for scheduled URL checks
- Docker Compose setup for local PostgreSQL and Redis

## Tech Stack

- Python 3.11+
- FastAPI
- SQLAlchemy + async PostgreSQL
- Alembic
- Celery
- Redis
- Pydantic
- Passlib / bcrypt
- python-jose

## Project Structure

- `main.py` — FastAPI application and API routes
- `app/database.py` — database engine and session factory
- `app/models.py` — SQLAlchemy models for users and monitors
- `app/schemas.py` — request/response models
- `app/security.py` — password hashing and JWT helpers
- `app/tasks.py` — Celery task for checking URL health
- `app/celery_app.py` — Celery app configuration
- `alembic/` — database migration files
- `docker-compose.yml` — local PostgreSQL and Redis services
- `requirements.txt` — Python dependencies

## Local Development Setup

### 1) Clone the repository

```bash
git clone <repo-url>
cd pulsewatch
```

### 2) Create and activate a virtual environment

Windows (PowerShell):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
python -m venv .venv
source .venv/bin/activate
```

### 3) Install dependencies

```bash
pip install -r requirements.txt
```

### 4) Configure environment variables

Create a `.env` file in the project root with the following values:

```env
DATABASE_URL=postgresql+asyncpg://pulsewatch:pulsewatch123@localhost:5432/pulsewatch
SECRET_KEY=replace-with-a-long-random-secret
REDIS_URL=redis://localhost:6379/0
```

Notes:

- `DATABASE_URL` should match the PostgreSQL instance you want to use.
- `SECRET_KEY` is used for JWT generation and validation.
- `REDIS_URL` is used by Celery.

### 5) Start PostgreSQL and Redis

The project includes Docker Compose support for local infrastructure:

```bash
docker compose up -d postgres redis
```

This starts:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

### 6) Run database migrations

```bash
alembic upgrade head
```

If the database is empty and the migration files are present, this creates the schema.

### 7) Start the API server

```bash
uvicorn main:app --reload
```

The app will be available at:

- `http://127.0.0.1:8000`

## API Endpoints

### Auth

- `POST /auth/signup` — create a new user
- `POST /auth/login` — log in and receive a JWT
- `GET /auth/me` — return the current authenticated user

### Monitors

- `POST /monitors` — create a monitor for the current user
- `GET /monitors` — list monitors for the current user

### Health check

- `GET /` — simple server status response

## Example Flow

1. Sign up with a valid email and password.
2. Log in to receive a bearer token.
3. Use the token on subsequent requests in the `Authorization` header:

```http
Authorization: Bearer <token>
```

4. Create monitors by posting a URL and a polling interval.

## Celery Tasks

The project has a basic Celery task in `app/tasks.py`:

```python
@celery_app.task
def check_url(url: str):
    ...
```

You can run the worker with:

```bash
celery -A app.celery_app worker --loglevel=info
```

This is useful for background URL checks and future monitor scheduling logic.

## Database and Migration Notes

- Models live in `app/models.py`.
- Alembic migrations are stored in `alembic/versions/`.
- When changing models, generate a new migration:

```bash
alembic revision --autogenerate -m "describe change"
alembic upgrade head
```

## Troubleshooting

- If the app fails to connect to PostgreSQL, confirm the `DATABASE_URL` is correct and the database container is running.
- If JWT auth fails, verify `SECRET_KEY` is set and non-empty.
- If Celery cannot connect, check that Redis is running on `localhost:6379`.

## License

This project is licensed under the terms in the `LICENSE` file.
