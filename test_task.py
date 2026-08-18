from app.tasks import check_url

result = check_url.delay(1, "https://google.com")
print("Task sent! ID:", result.id)