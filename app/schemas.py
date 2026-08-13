from pydantic import BaseModel, EmailStr

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