import httpx
import asyncio
from app.celery_app import celery_app
from app.database import AsyncSessionLocal
from app.models import CheckResult

async def _save_result(monitor_id: int, status_code: int | None, is_up: bool):
    async with AsyncSessionLocal() as db:
        result = CheckResult(monitor_id=monitor_id, status_code=status_code, is_up=is_up)
        db.add(result)
        await db.commit()

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
    asyncio.run(_save_result(monitor_id, status_code, is_up))
    return {"monitor_id": monitor_id, "status_code": status_code, "up": is_up}