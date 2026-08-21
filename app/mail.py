import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from dotenv import load_dotenv

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

async def send_downtime_email(to_email: str, url: str):
    message = MessageSchema(
        subject=f"🔴 PulseWatch Alert: {url} is DOWN",
        recipients=[to_email],
        body=f"Your monitored URL {url} just went down. We'll keep checking and notify you when it's back up.",
        subtype=MessageType.plain,
    )
    fm = FastMail(conf)
    await fm.send_message(message)