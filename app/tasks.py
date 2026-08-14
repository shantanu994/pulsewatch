import httpx
from app.celery_app import celery_app

@celery_app.task
def check_url(url: str):
    try:
        response = httpx.get(url, timeout=10)
        print(f"Checked {url} -> status {response.status_code}")
        return {"url": url, "status_code": response.status_code, "up": response.status_code < 400}
    except httpx.RequestError as e:
        print(f"Checked {url} -> failed: {e}")
        return {"url": url, "status_code": None, "up": False}