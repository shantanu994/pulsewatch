import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "pulsewatch",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.autodiscover_tasks(["app"])

celery_app.conf.beat_schedule = {
    "run-all-checks-every-minute": {
        "task": "app.tasks.run_all_checks",
        "schedule": 60.0,
    },
}