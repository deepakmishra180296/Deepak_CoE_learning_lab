def test_capture_console_error(page):
    page.goto("https://example.com")
    page.evaluate("console.error('something went wrong')")
    assert True