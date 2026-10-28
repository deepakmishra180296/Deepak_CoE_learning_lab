import re
from playwright.sync_api import Page, BrowserContext, expect

LOGIN_URL = "https://the-internet.herokuapp.com/login"
SECURE_URL = "https://the-internet.herokuapp.com/secure"


def login(page: Page):
    page.goto(LOGIN_URL)
    page.get_by_label("Username").fill("tomsmith")
    page.get_by_label("Password").fill("SuperSecretPassword!")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url(re.compile(r"/secure"))


def test_secure_page_after_cookies_cleared_redirects_to_login(page: Page, context: BrowserContext):
    login(page)

    context.clear_cookies()  # session expires
    page.reload()

    expect(page).to_have_url(re.compile(r"/login"))
    expect(page.locator("#flash")).to_contain_text("You must login")


def test_logout_in_one_tab_invalidates_the_other(context: BrowserContext):
    tab_a, tab_b = context.new_page(), context.new_page()
    login(tab_a)

    tab_b.goto(SECURE_URL)
    expect(tab_b.get_by_role("heading", name="Secure Area", exact=True)).to_be_visible()

    tab_a.get_by_role("link", name="Logout").click()
    tab_b.reload()

    expect(tab_b).to_have_url(re.compile(r"/login"))


def test_dialog_is_recorded_and_dismissed(page: Page, global_error_handler):
    page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    page.get_by_role("button", name="Click for JS Confirm").click()

    expect(page.locator("#result")).to_have_text("You clicked: Cancel")
    assert any("[dialog:confirm]" in m for m in global_error_handler)
