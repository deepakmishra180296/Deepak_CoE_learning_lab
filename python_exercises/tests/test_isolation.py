import pytest
import re
from playwright.sync_api import Page, expect

BASE_URL = "https://sauce-demo.myshopify.com/"


def add_grey_jacket(page: Page):
    #adds an item to the cart - in practical scenario this can be an api or method that can be used to create order
    page.goto(BASE_URL)
    initial_count = get_cart_count(page)

    page.get_by_text("Grey jacket").click()
    add_to_cart_btn = page.get_by_role("button", name="Add to cart")
    expect(add_to_cart_btn).to_be_enabled(timeout=5000)
    add_to_cart_btn.click()
    
    expect(page.locator("a.cart.desktop")).to_contain_text(str(initial_count + 1), timeout=10000)

def get_cart_count(page: Page) -> int:
    #fetching the cart count - in practical scenario this can be an api or method that can be used to fetch details
    text = page.locator("a.cart.desktop").text_content()
    match = re.search(r'\d+', text)
    return int(match.group()) if match else 0

def test_add_to_cart(page: Page):
    """
    This test verifies if an item is correctly added to the cart.
    """
    page.goto(BASE_URL)
    cart_count_initial = get_cart_count(page)
    add_grey_jacket(page)
    expect(page.locator("a.cart.desktop")).to_contain_text(f"{cart_count_initial + 1}")

def test_checkout_without_cart(page: Page):
    """
    This test uses "add_grey_jacket" method to add items to the cart. 
    This could be an api or fixture in practical scenario which can be 
    then used to create orders instead of depending on "test_add_to_cart".
    """
    page.goto(BASE_URL)
    cart_count_initial = get_cart_count(page)
    if cart_count_initial == 0:
        add_grey_jacket(page)
    page.goto(BASE_URL + "cart")
    page.locator("input[name='checkout']").click()
    expect(page).to_have_title('Checkout - Sauce Demo')
