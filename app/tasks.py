import httpx
from app.celery_app import celery_app
from app.database import SyncSessionLocal
from app.models import CheckResult, Monitor

@celery_app.task
def check_url(monitor_id: int, url: str):
    try:
        response = httpx.get(url, timeout=10)
        status_code = response.status_code
        is_up = status_code < 400
    except httpx.RequestError:
        status_code = None
        is_up = False

    print(f"Checked {url} -> up={is_up}, status={status_code}")

    with SyncSessionLocal() as db:
        result = CheckResult(monitor_id=monitor_id, status_code=status_code, is_up=is_up)
        db.add(result)
        db.commit()

    return {"monitor_id": monitor_id, "status_code": status_code, "up": is_up}


@celery_app.task
def run_all_checks():
    with SyncSessionLocal() as db:
        monitors = db.query(Monitor).filter(Monitor.is_active == True).all()

    for m in monitors:
        check_url.delay(m.id, m.url)

    return f"Queued {len(monitors)} checks"