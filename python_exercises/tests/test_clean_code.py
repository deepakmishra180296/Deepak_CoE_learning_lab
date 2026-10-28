import pytest
from playwright.sync_api import Page, Locator, expect


GREENKART_URL = "https://rahulshettyacademy.com/seleniumPractise/#/"
DISCOUNT_PROMO_CODE = "rahulshettyacademy"
PROMO_APPLIED_MESSAGE = "Code applied ..!"
PROMO_RESPONSE_TIMEOUT_MS = 30000
DELIVERY_COUNTRY = "India"
ORDER_SUCCESS_KEYWORD = "Thank you, your order has been placed successfully"



def open_catalog(page: Page) -> None:
    page.goto(GREENKART_URL)
    expect(page.locator(".products")).to_be_visible()


def filter_catalog(page: Page, search_term: str) -> None:
    page.locator(".search-keyword").fill(search_term)
    expect(page.locator(".product").first).to_be_visible()


def get_product_card(page: Page, product_name: str) -> Locator:
    return page.locator(".product").filter(has_text=product_name)


def add_product_to_cart(page: Page, product_name: str, quantity: int = 1) -> None:
    product_card = get_product_card(page, product_name)
    expect(product_card).to_be_visible()

    if quantity > 1:
        quantity_input = product_card.locator("input.quantity")
        quantity_input.fill(str(quantity))

    add_to_cart_button = product_card.locator("button", has_text="ADD TO CART")
    add_to_cart_button.click()


def proceed_from_cart_to_checkout(page: Page) -> None:
    page.locator(".cart-icon img").click()
    checkout_button = page.locator("button", has_text="PROCEED TO CHECKOUT")
    expect(checkout_button).to_be_visible()
    checkout_button.click()
    page.wait_for_url("**/cart")


def apply_discount_code(page: Page, promo_code: str) -> None:
    page.locator("input.promoCode").fill(promo_code)
    page.locator("button.promoBtn").click()

    promo_status = page.locator(".promoInfo")
    expect(promo_status).to_have_text(PROMO_APPLIED_MESSAGE, timeout=PROMO_RESPONSE_TIMEOUT_MS)


def complete_order_placement(page: Page, country: str) -> None:
    page.locator("button", has_text="Place Order").click()
    
    country_dropdown = page.locator(".wrapperTwo select")
    country_dropdown.select_option(country)

    terms_checkbox = page.locator("input.chkAgree")
    terms_checkbox.check()
    expect(terms_checkbox).to_be_checked()

    page.locator("button", has_text="Proceed").click()


def test_user_can_purchase_filtered_products_with_promo_discount(page: Page) -> None:

    open_catalog(page)
    filter_catalog(page, search_term="ber")

    add_product_to_cart(page, product_name="Cucumber", quantity=2)
    add_product_to_cart(page, product_name="Raspberry", quantity=1)

    proceed_from_cart_to_checkout(page)
    apply_discount_code(page, promo_code=DISCOUNT_PROMO_CODE)
    complete_order_placement(page, country=DELIVERY_COUNTRY)

    confirmation_banner = page.locator(".wrapperTwo")
    expect(confirmation_banner).to_contain_text(ORDER_SUCCESS_KEYWORD)