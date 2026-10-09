import pytest
from playwright.sync_api import Page, expect

def test_retry_logic(page:Page):
    # the test is a demo for retry mechanism, please change any locator text to fail the test and see the rerun

    page.goto("https://playwrightlab.github.io")

    #wait for the promt when button is visible
    ready_status_promt = page.get_by_text('Success! Click now')
    expect(ready_status_promt).to_be_visible(timeout=50000)

    #get the button locator and click on it
    grab_btn = page.get_by_role("button", name="Grab It!").or_(page.get_by_text("Grab It!"))
    expect(grab_btn).to_be_enabled(timeout=5000)
    grab_btn.click()

    #assert correct message is dispalyed on the UI
    success_msg = page.get_by_text("You caught it!")
    expect(success_msg).to_be_visible(timeout=5000)