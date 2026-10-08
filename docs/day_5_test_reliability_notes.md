# Playwright & Test Reliability – Study Notes

## 1. What Makes a Test Suite Brittle vs Resilient

- **Brittle tests** fail easily when there are small UI or code changes, even when the actual feature still works.
- Hard-coded waits, fragile XPath/CSS selectors, and dependency on test order are common causes.
- **Resilient tests** depend on stable user-facing behavior rather than implementation details.
- Use reliable locators, proper waits, isolated test data, and clear assertions to make tests more stable.
- A good test should fail because of a real problem, not because the test itself is fragile.

## 2. Flaky Test Patterns and Their Root Causes

- A **flaky test** sometimes passes and sometimes fails without any change in the application.
- Common causes include race conditions, fixed sleeps, network delays, shared test data, and tests depending on another test.
- Tests that rely on external services or unpredictable data can also become flaky.
- First identify whether the failure is related to timing, data, environment, or the application itself.
- Retries can hide flakiness, so the actual root cause should still be investigated.

## 3. Playwright Error Handling

- **Console errors:** Listen to `page.on("console")` to capture browser console messages, especially `console.error`.
- **Page errors:** `page.on("pageerror")` helps detect unhandled JavaScript errors occurring inside the page.
- **Network failures:** `page.on("requestfailed")` can capture requests that fail because of connection or network problems.
- These events are useful for debugging because a test can pass while the browser is still reporting errors.
- In larger frameworks, capture these errors in logs or test reports instead of handling them separately in every test.

## 4. Retry Mechanism in Playwright Python

- Playwright supports retries through the **Pytest plugin** using the `--retries` option.
- Example: `pytest --retries=2` allows a failed test to run again before being marked as failed.
- Retries are useful for temporarily unstable environments, but they should not be used to hide genuinely flaky tests.
- A test that passes only after retries should still be investigated and its root cause fixed.
- Retry count can also be configured in `pytest.ini` when the project needs a consistent setting.

## 5. Soft Assertion vs Hard Assertion

- **Hard assertion** stops the test immediately when an important expected condition fails.
- Use hard assertions when the next steps depend on the condition being true.
- **Soft assertions** allow the test to continue after a failed check, so multiple issues can be reported together.
- Use soft assertions for independent validations where one failure does not make the remaining checks meaningless.
- The goal is not to use one everywhere; choose based on whether continuing the test makes sense.

## 6. Test Isolation – Why Each Test Should Own Its State

- Each test should create and clean up the data/state it needs instead of depending on another test.
- For example, an order approval test should create its own required order through setup or a fixture rather than depending on an order test running first.
- This allows tests to run independently, in parallel, or in any order.
- Isolation also makes failures easier to understand because one test cannot break another test.
- Fixtures, API setup, database setup, and teardown are useful ways to prepare state without duplicating long UI flows.

## 7. Screenshot and Video Capture on Failure

- Screenshots help show exactly what the browser looked like when a test failed.
- Video is useful when the failure depends on a sequence of actions, timing, navigation, or unexpected UI behavior.
- Capturing them **only on failure** keeps the test artifacts smaller and makes reports easier to review.
- Playwright can be configured to retain screenshots and videos for failed tests when using the Pytest plugin.
- These artifacts should support debugging, not replace proper logs and error messages.

## 8. Reference: Core Files in this learning

Here is a quick overview of what each file:

- **[`pytest.ini`](../pytest.ini)**
  This is the main configuration file. It tells Pytest to automatically capture screenshots, videos, and traces when tests fail, and sets up our retry logic so tests get re-executed after failure.

- **[`conftest.py`](../tests/conftest.py)**
  This as the global setup file. It contains a global error handler that automatically listens for console errors and page crashes in the background, keeping our actual test scripts clean and focused.

- **[`test_retry.py`](../tests/test_retry.py)**
  This file is an example on how to handle dynamic web elements using retry logic. It uses Playwright's built-in assertions to patiently wait for a button to appear and become clickable, proving how to avoid failures caused by slow loading times. To triger the rerun we can change the locator slightly such that it fails  we can decrease the timeout value.

- **[`test_isolation.py`](../tests/test_isolation.py)**
  Example file to demonstrate tests shouldn't rely on each other. It shows robust, isolated tests that use setup fixtures to guarantee they always start with a clean slate.

- **[`test_gloabal_error.py`](../tests/test_global_error.py)**
  The script inserts a console error in the page that is than capture by global error handler that is set up in conftest.py file.
