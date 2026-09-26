# PulseWatch

**Live demo:** https://pulsewatch-mu.vercel.app
**API:** https://pulsewatch-e0gj.onrender.com

A distributed uptime-monitoring platform: register a URL, get automatic health checks on a schedule, track uptime percentage and check history, and receive an email when something goes down.

Built from scratch as a learning project to explore backend and distributed-systems concepts including authentication, background job processing, scheduling, and data isolation.

> Note: the free-tier deployment sleeps after periods of inactivity on Render. The first request after idle time may take 30-50 seconds to respond.

---

## Features

- JWT-based authentication with signup, login, and protected routes
- Create, list, pause/resume, and delete monitors with per-user isolation
- Automatic scheduled health checks respecting each monitor's individual interval
- Uptime percentage and check-history tracking
- Email alerts on downtime with transition-based detection, so repeated failures do not send repeated alerts
- Responsive React dashboard with live status, search, filtering, and monitor detail views

## Tech Stack

**Backend:** FastAPI (async), SQLAlchemy, Alembic, PostgreSQL, JWT (python-jose), bcrypt, httpx, fastapi-mail
**Background jobs (local development):** Celery, Celery Beat, Redis
**Frontend:** React, Vite, Tailwind CSS, React Router, Recharts, Framer Motion
**Infrastructure:** Docker Compose (local), Render (API), Neon (Postgres), Vercel (frontend)

## Architecture

```text
                    +--------------+
                    |   Frontend   |  React dashboard + auth
                    +------+-------+
                           | REST (JWT auth)
                    +------v-------+
                    |  API Server  |  FastAPI: auth, monitors, uptime
                    +------+-------+
                           |
                    +------v-------+
                    |  PostgreSQL  |  users, monitors, check_results
                    +--------------+

Local development also runs:
  Celery worker + Celery Beat + Redis
  -> scheduled background checks, decoupled from the API process
```

### Production deployment

Locally, scheduled checks run through Celery, Redis, and Celery Beat: a real message queue and scheduler decoupled from the API process. Most free hosting tiers support web services more readily than always-on background workers.

To keep the live demo functional without a paid worker, the production deployment uses an external free scheduler ([cron-job.org](https://cron-job.org/)) that calls `POST /internal/trigger-checks` every minute. The endpoint runs the same check logic synchronously and checks only monitors whose individual interval has elapsed since their last check. The Celery/Redis architecture remains available for local development.

## Local Development Setup

```bash
# clone and enter the repo
git clone https://github.com/shantanu994/pulsewatch.git
cd pulsewatch

# backend setup
cp .env.example .env          # fill in your own values
python -m venv venv
venv\\Scripts\\activate       # or source venv/bin/activate on Mac/Linux
pip install -r requirements.txt
docker compose up -d          # starts Postgres + Redis
alembic upgrade head
uvicorn main:app --reload

# in separate terminals:
celery -A app.celery_app worker --loglevel=info --pool=solo
celery -A app.celery_app beat --loglevel=info

# frontend setup, in a separate terminal
cd frontend
cp .env.example .env
npm install
npm run dev
```

The frontend is available at `http://localhost:5173`. The local API is available at `http://127.0.0.1:8000`.

### Environment variables

Backend variables are defined in `.env.example`:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection URL
- `SECRET_KEY` - long, random JWT signing key
- `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, `MAIL_SERVER`, and `MAIL_PORT` - optional SMTP settings for email alerts

Frontend variables are defined in `frontend/.env.example`:

- `VITE_API_URL` - backend API base URL, such as `http://127.0.0.1:8000`

Do not commit `.env` files or real credentials.

## API Endpoints

```text
GET    /                         - service health
POST   /auth/signup              - create account
POST   /auth/login               - returns a JWT access token
GET    /auth/me                  - current user (protected)

POST   /monitors                 - create a monitor (protected)
GET    /monitors                 - list your monitors (protected)
PATCH  /monitors/{id}            - pause/resume or update interval (protected)
DELETE /monitors/{id}            - delete a monitor and its history (protected)
GET    /monitors/{id}/uptime     - uptime percentage over a time window (protected)
GET    /monitors/{id}/results    - check history (protected)

POST   /internal/trigger-checks  - run due checks for the external scheduler
```

## Testing

The repository currently contains task smoke scripts rather than a comprehensive automated test suite:

```bash
pytest test_task.py test_downtime.py -v
```

Run frontend checks from the `frontend` directory:

```bash
npm run lint
npm run build
```

## What's Not Included Yet

- Response-time (latency) tracking; checks currently record status and up/down state
- Incident grouping; downtime appears as individual check rows rather than incidents with start, end, and duration
- Multi-region checks
- Real-time push updates through WebSockets
- Comprehensive automated test coverage
- Rate limiting and SSRF protection on the monitor URL field

## What I Learned Building This

This was my first substantial project using FastAPI, SQLAlchemy, Alembic, Celery, JWT authentication, Docker, and React. Along the way, I diagnosed a passlib/bcrypt version conflict, separated async and sync database sessions for Celery, fixed a foreign-key cascade delete issue, resolved CORS configuration problems, and adapted a Celery-based architecture for free-tier deployment.

## License

See [LICENSE](LICENSE) for details.