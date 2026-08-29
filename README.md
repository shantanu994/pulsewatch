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

## Prerequisites

- Python 3.9+
- Node.js 16+ (for frontend)
- PostgreSQL 12+
- Redis 6+
- Docker & Docker Compose

## Environment Setup

1. Clone the repo
2. Copy `.env.example` to `.env` and configure:
   - `DATABASE_URL` — PostgreSQL connection string
   - `REDIS_URL` — Redis connection URL
   - `SECRET_KEY` — JWT secret key
   - `MAIL_USERNAME` & `MAIL_PASSWORD` — SMTP credentials for email alerts
   - `MAIL_FROM` — Sender email address

## Running Locally

### Backend Setup

1. Create virtual environment: `python -m venv venv`
2. Activate: `source venv/bin/activate` (or `venv\Scripts\activate` on Windows)
3. Install dependencies: `pip install -r requirements.txt`
4. Start infrastructure: `docker compose up -d`
5. Initialize database: `alembic upgrade head`

### Running Backend Services

In separate terminals, run:

1. **FastAPI server**: `uvicorn main:app --reload`
2. **Celery worker**: `celery -A app.celery_app worker --loglevel=info --pool=solo`
3. **Celery Beat** (scheduler): `celery -A app.celery_app beat --loglevel=info`

### Frontend Setup

1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Access at `http://localhost:5173`

## API Endpoints

- `POST /auth/signup` — create account
- `POST /auth/login` — get access token
- `GET /auth/me` — current user info (protected)
- `POST /monitors` — create a monitor (protected)
- `GET /monitors` — list your monitors (protected)
- `GET /monitors/{id}/uptime` — uptime percentage (protected)

## Testing

Run the test suite:

```bash
pytest test_task.py test_downtime.py -v
```

- **test_task.py** — Tests for Celery task execution and health check logic
- **test_downtime.py** — Tests for downtime detection and alert triggering

## Project Structure

```
.
├── app/                 # Backend application
│   ├── celery_app.py    # Celery configuration
│   ├── database.py      # Database connection & session
│   ├── models.py        # SQLAlchemy ORM models
│   ├── schemas.py       # Pydantic validation schemas
│   ├── security.py      # JWT & password utilities
│   ├── tasks.py         # Celery periodic tasks
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
3. **Scheduled Checks** — Celery Beat triggers health checks every minute
4. **Health Check Task** — Worker sends HTTP request and records result
5. **Alert on State Change** — Email sent only when status changes from up→down

## Troubleshooting

- **Redis connection error**: Ensure Redis is running (`docker compose ps`)
- **Database migration issues**: Check PostgreSQL is accessible and run `alembic upgrade head`
- **Celery tasks not running**: Verify both worker and beat are active; check logs for errors
- **Email not sending**: Confirm SMTP credentials in `.env` and MAIL_FROM is valid

## License

See LICENSE file for details.
