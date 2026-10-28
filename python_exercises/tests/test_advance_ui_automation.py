import pytest
from playwright.sync_api import sync_playwright, Page, expect
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

@pytest.fixture(scope="function")
def page(page: Page):
    expect.set_options(timeout=30000)
    page.context.set_default_navigation_timeout(60000)
    page.context.set_default_timeout(30000)
    page.set_viewport_size({"width": 1920, "height": 1080})
    return page

def test_shadow_dom(page: Page):
    page.goto("https://the-internet.herokuapp.com/shadowdom", wait_until="networkidle")
    
    
    slotted_text = page.locator("my-paragraph span[slot='my-text']")
    expect(slotted_text).to_be_visible()
    expect(slotted_text).to_have_text("Let's have some different text!")

    shadow_text = page.locator("my-paragraph p")
    expect(shadow_text).to_be_visible()
        

def test_iframe(page: Page):
    page.goto("https://the-internet.herokuapp.com/iframe", wait_until="domcontentloaded")
    
    frame_locator = page.frame_locator("iframe")
    editor_body = frame_locator.locator("#tinymce")
    
    expect(editor_body).to_be_visible()
    
    editor_body.evaluate("el => el.setAttribute('contenteditable', 'true')")
    
    expect(editor_body).to_have_attribute("contenteditable", "true")
    
    editor_body.clear()
    
    editor_body.fill("Hello from Playwright Automation!")
    expect(editor_body).to_have_text("Hello from Playwright Automation!")
    

def test_multi_select(page: Page):
    page.goto("https://the-internet.herokuapp.com/checkboxes", wait_until="domcontentloaded")
    
    checkboxes = page.locator("input[type='checkbox']")
    expect(checkboxes).to_have_count(2)
    
    checkbox1 = checkboxes.nth(0)
    checkbox2 = checkboxes.nth(1)
    
    expect(checkbox1).not_to_be_checked()
    expect(checkbox2).to_be_checked()
    
    checkbox1.check()
    expect(checkbox1).to_be_checked()
    expect(checkbox2).to_be_checked()
    
    checkbox1.uncheck()
    checkbox2.uncheck()
    expect(checkbox1).not_to_be_checked()
    expect(checkbox2).not_to_be_checked()
        

def test_drag_and_drop(page: Page):
    page.goto("https://the-internet.herokuapp.com/drag_and_drop", wait_until="domcontentloaded")
    
    box_a = page.locator("#column-a")
    box_b = page.locator("#column-b")
    
    expect(box_a).to_have_text("A")
    expect(box_b).to_have_text("B")
    
    box_a.drag_to(box_b)
    
    expect(box_a).to_have_text("B")
    expect(box_b).to_have_text("A")
        

def test_file_upload(page: Page, tmp_path):
    # Create a temporary file to upload
    test_file = tmp_path / "test_upload.txt"
    test_file.write_text("Hello World! This is an automated file upload test.")
    
    page.goto("https://the-internet.herokuapp.com/upload", wait_until="domcontentloaded")
    
    page.locator("#file-upload").set_input_files(str(test_file))
    
    page.locator("#file-submit").click()
    
    expect(page.locator("h3")).to_have_text("File Uploaded!")
    expect(page.locator("#uploaded-files")).to_contain_text("test_upload.txt")
        
