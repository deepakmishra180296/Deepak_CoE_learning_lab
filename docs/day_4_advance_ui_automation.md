# Day 4 – Advanced UI Automation (Playwright + Pytest)

### File Path: [Test Advance UI Automation](../python_exercises/tests/test_advance_ui_automation.py)

Practice tests for tricky UI elements using Playwright (Python) against [the-internet.herokuapp.com](https://the-internet.herokuapp.com).

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


## 1. Shadow DOM

### Summary
Shadow DOM is used by web components to keep their internal HTML and CSS separate from the rest of the page.

### Key points
- Playwright locators can find elements inside open Shadow DOM without any special shadow-root API.
- XPath does not pierce shadow roots, and closed Shadow DOM is not supported by Playwright locators.

## 2. Iframes and Context Isolation

### Summary
An iframe is basically a separate document displayed inside another page. Elements inside it belong to a different frame, so a normal page locator may not find them.

### Key points
- Playwright treats the main page and its iframes as separate frame contexts.
- `frame_locator()` is useful when we want to interact with elements inside an iframe.
- We can chain normal locators after `frame_locator()` to find buttons, inputs, or other elements inside the frame.
- Nested iframes need another frame locator to reach the elements in the inner frame.

## 3. Auto-waiting vs Explicit Waits

### Summary
One useful thing about Playwright is that it already waits for many conditions before performing an action. Adding fixed sleeps everywhere is usually unnecessary and can make tests slower or flaky.

### Key points
- Before clicking, Playwright checks conditions such as visibility, stability, whether the element receives events, and whether it is enabled.
- Assertions such as `to_be_visible()` and `to_have_text()` retry until the expected condition is met or the timeout is reached.
- `wait_for_timeout()` simply pauses for a fixed duration. It does not confirm that the application is actually ready.
- We should wait for the condition we care about rather than guessing how many seconds the application needs.
- Explicit waits still have their place when we need to wait for a particular state or event that is not covered by a normal action.
- For debugging, a short fixed wait can sometimes be useful, but it should not be the default approach in test cases.
