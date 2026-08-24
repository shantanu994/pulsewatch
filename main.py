from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserOut
from app.security import hash_password

from app.security import hash_password, verify_password, create_access_token

from fastapi.security import OAuth2PasswordBearer
from app.security import decode_access_token

from app.models import Monitor
from app.schemas import MonitorCreate, MonitorOut

from app.models import CheckResult
from app.schemas import CheckResultOut
from app.schemas import MonitorUpdate

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@app.get("/")
def read_root():
    return {"message": "PulseWatch is alive"}

@app.post("/auth/signup", response_model=UserOut)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # check if email already exists
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=user_in.email,
        password_hash=hash_password(user_in.password),
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

@app.post("/auth/login")
async def login(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(user_in.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    email = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user

@app.get("/auth/me", response_model=UserOut)
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/monitors", response_model=MonitorOut)
async def create_monitor(
    monitor_in: MonitorCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    new_monitor = Monitor(
        url=monitor_in.url,
        interval_seconds=monitor_in.interval_seconds,
        user_id=current_user.id,
    )
    db.add(new_monitor)
    await db.commit()
    await db.refresh(new_monitor)
    return new_monitor


@app.get("/monitors", response_model=list[MonitorOut])
async def list_monitors(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Monitor).where(Monitor.user_id == current_user.id))
    return result.scalars().all()

@app.get("/monitors/{monitor_id}/results", response_model=list[CheckResultOut])
async def get_monitor_results(
    monitor_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    monitor_check = await db.execute(
        select(Monitor).where(Monitor.id == monitor_id, Monitor.user_id == current_user.id)
    )
    monitor = monitor_check.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")

    result = await db.execute(
        select(CheckResult)
        .where(CheckResult.monitor_id == monitor_id)
        .order_by(CheckResult.checked_at.desc())
    )
    return result.scalars().all()

from datetime import datetime, timedelta
from app.models import CheckResult

@app.get("/monitors/{monitor_id}/uptime")
async def get_uptime(
    monitor_id: int,
    hours: int = 24,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    monitor_result = await db.execute(
        select(Monitor).where(Monitor.id == monitor_id, Monitor.user_id == current_user.id)
    )
    monitor = monitor_result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")

    since = datetime.utcnow() - timedelta(hours=hours)
    results = await db.execute(
        select(CheckResult).where(CheckResult.monitor_id == monitor_id, CheckResult.checked_at >= since)
    )
    checks = results.scalars().all()

    if not checks:
        return {"monitor_id": monitor_id, "uptime_percent": None, "total_checks": 0}

    up_count = sum(1 for c in checks if c.is_up)
    uptime_percent = round((up_count / len(checks)) * 100, 2)

    return {"monitor_id": monitor_id, "uptime_percent": uptime_percent, "total_checks": len(checks)}

@app.patch("/monitors/{monitor_id}", response_model=MonitorOut)
async def update_monitor(
    monitor_id: int,
    update: MonitorUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Monitor).where(Monitor.id == monitor_id, Monitor.user_id == current_user.id)
    )
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")

    if update.is_active is not None:
        monitor.is_active = update.is_active
    if update.interval_seconds is not None:
        monitor.interval_seconds = update.interval_seconds

    await db.commit()
    await db.refresh(monitor)
    return monitor


@app.delete("/monitors/{monitor_id}")
async def delete_monitor(
    monitor_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Monitor).where(Monitor.id == monitor_id, Monitor.user_id == current_user.id)
    )
    monitor = result.scalar_one_or_none()
    if not monitor:
        raise HTTPException(status_code=404, detail="Monitor not found")

    await db.delete(monitor)
    await db.commit()
    return {"detail": "Monitor deleted"}