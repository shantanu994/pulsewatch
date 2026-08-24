from pydantic import BaseModel, EmailStr
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True

class MonitorCreate(BaseModel):
    url: str
    interval_seconds: int = 300

class MonitorOut(BaseModel):
    id: int
    url: str
    interval_seconds: int
    is_active: bool

    class Config:
        from_attributes = True

class CheckResultOut(BaseModel):
    id: int
    status_code: int | None
    is_up: bool
    checked_at: datetime

    class Config:
        from_attributes = True

class MonitorUpdate(BaseModel):
    is_active: bool | None = None
    interval_seconds: int | None = None