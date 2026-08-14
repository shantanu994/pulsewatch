from app.tasks import check_url

result = check_url.delay("https://google.com")
print("Task sent! ID:", result.id)