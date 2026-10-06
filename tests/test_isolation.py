import pytest
import re
from playwright.sync_api import Page, expect

BASE_URL = "https://sauce-demo.myshopify.com/"


def add_grey_jacket(page: Page):
    page.goto(BASE_URL)
    initial_count = get_cart_count(page)

    page.get_by_text("Grey jacket").click()
    add_to_cart_btn = page.get_by_role("button", name="Add to cart")
    expect(add_to_cart_btn).to_be_enabled(timeout=5000)
    add_to_cart_btn.click()
    
    # Wait for the item to actually be added via AJAX before proceeding
    expect(page.locator("a.cart.desktop")).to_contain_text(str(initial_count + 1), timeout=10000)

def get_cart_count(page: Page) -> int:
    """Helper to safely extract the integer cart count"""
    text = page.locator("a.cart.desktop").text_content()
    match = re.search(r'\d+', text)
    return int(match.group()) if match else 0

def test_add_to_cart(page: Page):
    """Test adding an item to the cart and verifying the cart count."""
    page.goto(BASE_URL)
    cart_count_initial = get_cart_count(page)
    add_grey_jacket(page)
    expect(page.locator("a.cart.desktop")).to_contain_text(f"{cart_count_initial + 1}")

def test_checkout_without_cart(page: Page):
    """BAD: Test assumes the cart already has an item from the previous test."""
    page.goto(BASE_URL)
    cart_count_initial = get_cart_count(page)
    if cart_count_initial == 0:
        add_grey_jacket(page)
    page.goto(BASE_URL + "cart")
    page.locator("input[name='checkout']").click()
    expect(page).to_have_title('Checkout - Sauce Demo')