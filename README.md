# PulseWatch

A distributed uptime-monitoring platform. Register a URL, inspect recent check history and uptime, and receive email alerts when a monitored URL transitions from healthy to down.

## Features

- JWT-based authentication (signup/login)
- Create and manage monitors (URLs to watch)
- Automatic scheduled health checks via Celery Beat
- Uptime percentage calculation
- Email alerts on downtime (with spam prevention — only alerts on state change)
- Monitor history, pause/resume, and deletion from the web dashboard

## Tech Stack

- Backend: FastAPI (async), SQLAlchemy, Alembic
- Database: PostgreSQL
- Background jobs: Celery + Redis
- Auth: JWT (python-jose), bcrypt password hashing
- Email: fastapi-mail (SMTP)
- Infra: Docker Compose

## Architecture

PulseWatch is built around a FastAPI backend that handles authentication and monitor management, a PostgreSQL database for persistent state, and Redis/Celery workers that schedule periodic checks and trigger email alerts when a monitor transitions from healthy to down.

## Prerequisites

- Python 3.9+
- Node.js 16+ (for frontend)
- PostgreSQL 16 (provided by Docker Compose)
- Redis 7 (provided by Docker Compose)
- Docker & Docker Compose

## Environment Setup

1. Clone the repo.
2. Copy `.env.example` to `.env` and configure:
   - `DATABASE_URL` — PostgreSQL connection string
   - `REDIS_URL` — Redis connection URL
   - `SECRET_KEY` — JWT secret key
   - `MAIL_USERNAME` and `MAIL_PASSWORD` — SMTP credentials for email alerts
   - `MAIL_FROM` — Sender email address
   - `MAIL_SERVER` — SMTP server hostname
   - `MAIL_PORT` — SMTP server port

The included Docker Compose services use these local development values:

```env
DATABASE_URL=postgresql+asyncpg://pulsewatch:pulsewatch123@localhost:5432/pulsewatch
REDIS_URL=redis://localhost:6379/0
```

Use a long, random value for `SECRET_KEY`. Do not commit `.env` or real SMTP credentials.

## Running Locally

### Backend Setup

1. Create virtual environment: `python -m venv venv`
2. Activate it on macOS/Linux with `source venv/bin/activate`, or on Windows with `venv\Scripts\activate`
3. Install dependencies: `pip install -r requirements.txt`
4. Start PostgreSQL and Redis: `docker compose up -d`
5. Initialize database: `alembic upgrade head`

### Running Backend Services

In separate terminals, run:

1. **FastAPI server**: `uvicorn main:app --reload` (API at `http://127.0.0.1:8000`)
2. **Celery worker**: `celery -A app.celery_app worker --loglevel=info --pool=solo`
3. **Celery Beat** (scheduler): `celery -A app.celery_app beat --loglevel=info`

### Frontend Setup

1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Access the dashboard at `http://localhost:5173`

Beat runs the scheduler every 60 seconds and queues checks for active monitors. New monitors default to a 300-second interval in the data model; the current scheduler dispatches all active monitors on each run.

## API Endpoints

- `POST /auth/signup` — create account
- `POST /auth/login` — get access token
- `GET /auth/me` — current user info (protected)
- `POST /monitors` — create a monitor (protected)
- `GET /monitors` — list your monitors (protected)
- `GET /monitors/{id}/results` — recent check history (protected)
- `GET /monitors/{id}/uptime?hours=24` — uptime percentage for a time window (protected)
- `PATCH /monitors/{id}` — update active state or interval (protected)
- `DELETE /monitors/{id}` — delete a monitor (protected)

## Testing

Run the backend task tests:

```bash
pytest test_task.py test_downtime.py -v
```

- **test_task.py** — Tests for Celery task execution and health check logic
- **test_downtime.py** — Tests for downtime detection and alert triggering

Run the frontend checks from the `frontend` directory:

```bash
npm run lint
npm run build
```

## Project Structure

```
.
├── app/                 # Backend application
│   ├── celery_app.py    # Celery configuration
│   ├── database.py      # Database connection & session
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic validation schemas
│   ├── security.py      # JWT & password utilities
│   ├── tasks.py         # URL checks and periodic task dispatch
│   └── mail.py          # Email notification logic
├── frontend/            # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page-level components
│   │   └── lib/         # API client & utilities
│   └── package.json
├── alembic/             # Database migrations
├── main.py              # FastAPI app entry point
└── requirements.txt     # Python dependencies
```

## How It Works

1. **User Registration & Login** — JWT tokens issued on successful authentication
2. **Monitor Creation** — User registers a URL to monitor
3. **Scheduled Checks** — Celery Beat triggers the check dispatcher every minute
4. **Health Check Task** — A Celery worker sends an HTTP request and records the result
5. **Alert on State Change** — Email is sent only when a monitor changes from up to down

## Troubleshooting

- **Redis connection error**: Ensure Redis is running with `docker compose ps` and check `REDIS_URL`
- **Database migration issues**: Check PostgreSQL is accessible, verify `DATABASE_URL`, and run `alembic upgrade head`
- **Celery tasks not running**: Verify both worker and beat are active; check logs for errors
- **Email not sending**: Confirm all SMTP settings in `.env`, including `MAIL_SERVER` and `MAIL_PORT`, and verify `MAIL_FROM` is valid

## License

See LICENSE file for details.
