import pytest
from playwright.sync_api import sync_playwright, Page, expect
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

@pytest.fixture(scope="function")
def page():
    """
    Setup for tests using Playwright with Chrome (Chromium) browser.
    """
    with sync_playwright() as p:
        # Increase expect timeout as site is slow to respond
        expect.set_options(timeout=20000)
        
  
        browser = p.chromium.launch(
            headless=False, 
            channel="chrome",
            args=["--start-maximized"]
        )
        context = browser.new_context()
        # Increase navigation timeouts as site is slow to respond
        context.set_default_navigation_timeout(60000)
        context.set_default_timeout(30000)
        
        page = context.new_page()
        yield page
        # Cleanup
        browser.close()

def test_shadow_dom(page: Page):
    try:
        page.goto("https://the-internet.herokuapp.com/shadowdom")
        page.wait_for_timeout(2000) # Manual wait for observation
        
        slotted_text = page.locator("my-paragraph span[slot='my-text']")
        expect(slotted_text).to_be_visible()
        expect(slotted_text).to_have_text("Let's have some different text!")
        page.wait_for_timeout(1000) # Manual wait for observation
        
        list_items = page.locator("my-paragraph ul[slot='my-text'] li")
        expect(list_items).to_have_count(2)
        expect(list_items.nth(0)).to_have_text("Let's have some different text!")
        expect(list_items.nth(1)).to_have_text("In a list!")
        
        page.wait_for_timeout(2000) # Manual wait for observation
        
    except (PlaywrightTimeoutError, AssertionError) as e:
        pytest.fail(f"Expected validation or timeout exception: {e}")

def test_iframe(page: Page):
    try:
        page.goto("https://the-internet.herokuapp.com/iframe", wait_until="domcontentloaded")
        page.wait_for_timeout(2000) # Manual wait for observation
        
        frame_locator = page.frame_locator("iframe")
        editor_body = frame_locator.locator("#tinymce")
        
        expect(editor_body).to_be_visible()
        
        editor_body.evaluate("el => el.setAttribute('contenteditable', 'true')")
        
        expect(editor_body).to_have_attribute("contenteditable", "true")
        
        editor_body.clear()
        page.wait_for_timeout(1000) # Manual wait for observation
        
        editor_body.fill("Hello from Playwright Automation!")
        expect(editor_body).to_have_text("Hello from Playwright Automation!")
        
        page.wait_for_timeout(2000) # Manual wait for observation
        
    except (PlaywrightTimeoutError, AssertionError) as e:
        pytest.fail(f"Expected validation or timeout exception: {e}")

def test_multi_select(page: Page):
    try:
        page.goto("https://the-internet.herokuapp.com/checkboxes")
        page.wait_for_timeout(2000) # Manual wait for observation
        
        checkboxes = page.locator("input[type='checkbox']")
        expect(checkboxes).to_have_count(2)
        
        checkbox1 = checkboxes.nth(0)
        checkbox2 = checkboxes.nth(1)
        
        expect(checkbox1).not_to_be_checked()
        expect(checkbox2).to_be_checked()
        
        checkbox1.check()
        page.wait_for_timeout(1000) # Manual wait for observation
        expect(checkbox1).to_be_checked()
        expect(checkbox2).to_be_checked()
        
        checkbox1.uncheck()
        checkbox2.uncheck()
        expect(checkbox1).not_to_be_checked()
        expect(checkbox2).not_to_be_checked()
        
        page.wait_for_timeout(2000) # Manual wait for observation
        
    except (PlaywrightTimeoutError, AssertionError) as e:
        pytest.fail(f"Expected validation or timeout exception: {e}")

def test_drag_and_drop(page: Page):
    try:
        page.goto("https://the-internet.herokuapp.com/drag_and_drop")
        page.wait_for_timeout(2000) # Manual wait for observation
        
        box_a = page.locator("#column-a")
        box_b = page.locator("#column-b")
        
        expect(box_a).to_have_text("A")
        expect(box_b).to_have_text("B")
        
        box_a.drag_to(box_b)
        page.wait_for_timeout(1000) # Manual wait for observation
        
        expect(box_a).to_have_text("B")
        expect(box_b).to_have_text("A")
        
        page.wait_for_timeout(2000) # Manual wait for observation
        
    except (PlaywrightTimeoutError, AssertionError) as e:
        pytest.fail(f"Expected validation or timeout exception: {e}")

def test_file_upload(page: Page, tmp_path):
    try:
        # Create a temporary file to upload
        test_file = tmp_path / "test_upload.txt"
        test_file.write_text("Hello World! This is an automated file upload test.")
        
        page.goto("https://the-internet.herokuapp.com/upload")
        page.wait_for_timeout(2000) # Manual wait for observation
        
        page.locator("#file-upload").set_input_files(str(test_file))
        page.wait_for_timeout(1000) # Manual wait for observation
        
        page.locator("#file-submit").click()
        
        expect(page.locator("h3")).to_have_text("File Uploaded!")
        expect(page.locator("#uploaded-files")).to_contain_text("test_upload.txt")
        
        page.wait_for_timeout(3000) # Manual wait for observation
        
    except (PlaywrightTimeoutError, AssertionError) as e:
        pytest.fail(f"Expected validation or timeout exception: {e}")
