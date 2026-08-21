from app.tasks import check_url

check_url.delay(3, "https://thisisnotarealwebsite12345.com")