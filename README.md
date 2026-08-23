# PulseWatch

A distributed uptime-monitoring platform — register a URL, get automatic health checks every minute, and receive email alerts the moment something goes down.

## Features

- JWT-based authentication (signup/login)
- Create and manage monitors (URLs to watch)
- Automatic scheduled health checks via Celery Beat
- Uptime percentage calculation
- Email alerts on downtime (with spam prevention — only alerts on state change)

## Tech Stack

- Backend: FastAPI (async), SQLAlchemy, Alembic
- Database: PostgreSQL
- Background jobs: Celery + Redis
- Auth: JWT (python-jose), bcrypt password hashing
- Email: fastapi-mail (SMTP)
- Infra: Docker Compose

## Architecture

PulseWatch is built around a FastAPI backend that handles authentication and monitor management, a PostgreSQL database for persistent state, and Redis/Celery workers that schedule periodic checks and trigger email alerts when a monitor transitions from healthy to down.

## Running Locally

1. Clone the repo
2. Copy `.env.example` to `.env` and fill in your values
3. `docker compose up -d`
4. `pip install -r requirements.txt`
5. `alembic upgrade head`
6. `uvicorn main:app --reload`
7. In separate terminals: `celery -A app.celery_app worker --loglevel=info --pool=solo` and `celery -A app.celery_app beat --loglevel=info`

## API Endpoints

- `POST /auth/signup` — create account
- `POST /auth/login` — get access token
- `GET /auth/me` — current user info (protected)
- `POST /monitors` — create a monitor (protected)
- `GET /monitors` — list your monitors (protected)
- `GET /monitors/{id}/uptime` — uptime percentage (protected)
