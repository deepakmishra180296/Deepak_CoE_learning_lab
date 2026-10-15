def test_homepage_has_title(page):
    page.goto("https://playwright.dev/")
    assert "Playwright" in page.title()
