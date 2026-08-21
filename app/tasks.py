import httpx
from app.celery_app import celery_app
from app.database import SyncSessionLocal
from app.models import CheckResult, Monitor
from app.models import CheckResult, Monitor, User
from app.mail import send_downtime_email
import asyncio

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
        # find the most recent PREVIOUS result, before this one, to detect a transition
        last_result = (
            db.query(CheckResult)
            .filter(CheckResult.monitor_id == monitor_id)
            .order_by(CheckResult.checked_at.desc())
            .first()
        )
        was_up = last_result.is_up if last_result else True

        result = CheckResult(monitor_id=monitor_id, status_code=status_code, is_up=is_up)
        db.add(result)
        db.commit()

        # only email on a genuine transition: it WAS up, and now it's down
        if was_up and not is_up:
            monitor = db.query(Monitor).filter(Monitor.id == monitor_id).first()
            user = db.query(User).filter(User.id == monitor.user_id).first()
            asyncio.run(send_downtime_email(user.email, monitor.url))
            print(f"Downtime email sent to {user.email}")

    return {"monitor_id": monitor_id, "status_code": status_code, "up": is_up}


@celery_app.task
def run_all_checks():
    with SyncSessionLocal() as db:
        monitors = db.query(Monitor).filter(Monitor.is_active == True).all()

    for m in monitors:
        check_url.delay(m.id, m.url)

    return f"Queued {len(monitors)} checks"
