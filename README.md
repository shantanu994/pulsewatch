# pulsewatch

Pulsewatch is a scalable uptime monitoring and observability platform with real-time alerts, latency tracking, and public status pages.

This README describes the project status so far and provides step-by-step instructions to get the project running for development.

## Quick Overview

- **Purpose:** Monitor service uptime, gather latency metrics, send alerts, and publish public status pages.
- **Language:** Python
- **Web server:** ASGI (`uvicorn` + FastAPI style project layout)
- **Database:** PostgreSQL with Alembic for migrations

## Repository Structure (important files)

- `main.py` — application entrypoint.
- `requirements.txt` — Python dependencies.
- `alembic/` — migration configuration and migration scripts.
- `app/database.py` — DB connection and utilities.
- `app/models.py` — ORM models (users, etc.).
- `app/schemas.py` — Pydantic request/response schemas.
- `app/security.py` — auth and security helpers.

## Step-by-step: Development Setup

1. Clone the repository and change to the project folder:

   git clone <repo-url>
   cd pulsewatch

2. Create and activate a Python virtual environment (Windows example):

   python -m venv .venv
   .\.venv\Scripts\Activate.ps1 # PowerShell

3. Install dependencies:

   pip install -r requirements.txt

4. Configure environment variables:
   - Create a `.env` or set environment variables required by the app (DB URL, secret keys).
   - Typical variables:
     - `DATABASE_URL` — PostgreSQL connection string (e.g. `postgresql://user:pass@localhost:5432/pulsewatch`).
     - Any other secrets referenced by `app/security.py` or `main.py`.

5. Prepare the database and run migrations (uses Alembic):

   # ensure postgres is running and DATABASE_URL is set

   alembic upgrade head

   Note: Migration files live under `alembic/versions/`.

6. Run the application locally (development):

   uvicorn main:app --reload

7. Verify the app and database:
   - Check logs in the terminal where `uvicorn` runs.
   - Inspect the database (psql or a GUI) to ensure tables from `app/models.py` exist.

## Notes on Database and Migrations

- The project uses SQLAlchemy models in `app/models.py` and Alembic for migrations.
- If you change models, run `alembic revision --autogenerate -m "describe change"` and then `alembic upgrade head`.

## Running with Docker / Compose (optional)

- If a `docker-compose.yml` is provided, you can run a local Postgres and app using Docker Compose. Example:

  docker-compose up --build

Adjust compose service names and environment variables as needed.

## Development Tips

- Use `uvicorn main:app --reload` for rapid development with automatic reloads.
- Keep schema and model changes synchronized with Alembic migrations.
- Use the provided `alembic/versions/` migrations (there is at least one migration already present).

## Contributing

- Open issues and PRs with focused changes.
- When changing DB models, include migrations.

## License

See the `LICENSE` file in the repository.

---

If you'd like, I can add example `.env` templates, exact environment variable names found in the code, or a short troubleshooting section next.
