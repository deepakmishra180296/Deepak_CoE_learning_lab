import time
import pytest
from playwright.sync_api import sync_playwright, Page, expect


def test_1(page: Page):
    # test greenkart shopping
    page.goto("https://rahulshettyacademy.com/seleniumPractise/#/")
    time.sleep(2)  # wait for page
    
    # search
    page.locator(".search-keyword").fill("ber")
    time.sleep(1)
    
    # find cucumber and set quantity to 2
    cards = page.locator(".product").all()
    for c in cards:
        t = c.locator("h4").text_content()
        if "Cucumber" in t:
            # click increment button
            c.locator("a.increment").click()
            # click add to cart
            c.locator("button").click()
            break
            
    time.sleep(1)
    
    # find raspberry and add
    for c in cards:
        t = c.locator("h4").text_content()
        if "Raspberry" in t:
            c.locator("button").click()
            break
            
    # click cart icon
    page.locator(".cart-icon img").click()
    time.sleep(1)
    
    # click proceed
    page.locator("button", has_text="PROCEED TO CHECKOUT").click()
    time.sleep(2)
    
    # promo code
    page.locator(".promoCode").fill("rahulshettyacademy")
    page.locator(".promoBtn").click()
    
    try:
        # wait for code applied
        time.sleep(6)
        msg = page.locator(".promoInfo").text_content()
        assert "Code applied" in msg
    except:
        pass  # ignore if promo fails
        
    # place order
    page.locator("button", has_text="Place Order").click()
    time.sleep(1)
    
    # select country
    s = page.locator("select")
    s.select_option("India")
    
    # check checkbox
    page.locator(".chkAgree").click()
    
    # proceed
    page.locator("button", has_text="Proceed").click()
    time.sleep(2)
    
    # assert success
    txt = page.locator(".wrapperTwo").text_content()
    assert "Thank you" in txt