# Day 4 – Advanced UI Automation (Playwright + Pytest)

### File Path: [Test Advance UI Automation](../python_exercises/tests/test_advance_ui_automation.py)

Practice tests for tricky UI elements using Playwright (Python) against [the-internet.herokuapp.com](https://the-internet.herokuapp.com).

## Tests Covered

| Test | Page | What it validates |
|------|------|-------------------|
| `test_shadow_dom` | `/shadowdom` | Slotted text and list items inside a shadow DOM component |
| `test_iframe` | `/iframe` | Typing into a TinyMCE editor inside an iframe |
| `test_multi_select` | `/checkboxes` | Check / uncheck multiple checkboxes and verify state |
| `test_drag_and_drop` | `/drag_and_drop` | Swapping column A and B with `drag_to` |
| `test_file_upload` | `/upload` | Uploading a temp file and verifying the confirmation |

## Setup

- `page` fixture (function scope) launches **headed Chrome**, maximized
- Slow-site friendly timeouts:
  - `expect` timeout: 20s
  - Default timeout: 30s
  - Navigation timeout: 60s
- Browser is closed after each test

## Key Concepts

- **Shadow DOM**: Playwright locators pierce open shadow roots automatically
- **iFrames**: use `page.frame_locator()` to scope locators
- **Checkboxes**: `check()` / `uncheck()` with `to_be_checked()` assertions
- **Drag & drop**: `locator.drag_to(target)`
- **File upload**: `set_input_files()` with pytest's `tmp_path`
- **Assertions**: web-first `expect()` auto-waits and retries
- **Error handling**: Playwright timeouts and assertion errors are caught and reported via `pytest.fail`

## Notes

- `page.wait_for_timeout()` calls are only for visual observation; remove them for faster, CI-friendly runs
- Set `headless=True` in the fixture for CI
