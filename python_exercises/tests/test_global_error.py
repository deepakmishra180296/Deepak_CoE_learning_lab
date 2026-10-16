import pytest_check as check

def test_capture_console_error(page, global_error_handler):
    page.goto("https://example.com")
    page.evaluate("console.error('something went wrong')")
    check.is_true(len(global_error_handler) > 0, "Console error has been captured and logged.")