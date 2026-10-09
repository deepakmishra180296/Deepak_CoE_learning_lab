import pytest
from playwright.sync_api import Page, expect


BASE_URL = "https://example.com"

# Z - Zero (The Initial State)
def test_login_page_loads_correctly(page: Page):
    """Verify the state of the page before any user interaction."""
    page.goto(f"{BASE_URL}/login")
    
    # Verify fields are empty
    expect(page.locator('#username')).to_be_empty()
    expect(page.locator('#password')).to_be_empty()


# O - One (The Happy Path)
def test_one_user_valid_login_succeeds(page: Page):
    page.goto(f"{BASE_URL}/login")
    
    page.fill('#username', 'validUser')
    page.fill('#password', 'correctPassword')
    page.click('#login-btn')
    
    expect(page).to_have_url(f"{BASE_URL}/dashboard")


# M - Many (Scaling Up)
@pytest.mark.parametrize("role, user, pwd, expected_url", [
    ('admin', 'admin1', 'pass123', f"{BASE_URL}/admin-dashboard"),
    ('guest', 'guest1', 'pass123', f"{BASE_URL}/home")
])
def test_many_users_login_routing(page: Page, role, user, pwd, expected_url):
    page.goto(f"{BASE_URL}/login")
    page.fill('#username', user)
    page.fill('#password', pwd)
    page.click('#login-btn')
    
    expect(page).to_have_url(expected_url)


# B - Boundaries
def test_submit_empty_form(page: Page):
    page.goto(f"{BASE_URL}/login")
    
    # login without filling mandatory fields
    page.click('#login-btn')
    
    # Verify error message is dispalyed
    expect(page.locator('#username')).to_have_attribute('aria-invalid', 'true')
