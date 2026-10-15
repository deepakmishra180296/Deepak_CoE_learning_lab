# Day 2: Selenium to Playwright – Notes

## 1. Selenium vs Playwright – Architecture

- Selenium uses WebDriver to communicate with the browser. Playwright uses its own browser automation protocols and APIs, giving it a more integrated way to control supported browsers.
- In Selenium, setting up the driver and managing browser interactions through it.
- Playwright provides browser, context and page objects, with fixtures available in its test runner to handle setup and cleanup.
- A browser context is like an isolated browser session. It helps keep cookies, storage and other session data separate between tests.
- Playwright supports modern web scenarios such as multiple tabs, popups and frames through its own APIs.

## 2. Auto-Waiting and Actionability Checks

- Earlier, with Selenium, we used explicit waits to make sure an element was present or clickable before performing an action.
- Playwright automatically waits for the required conditions before performing actions such as clicking or filling an input.
- It doesn't simply wait for an element to exist. It checks whether the element is in a suitable state for the action.
- If the conditions aren't met within the timeout, the action fails instead of continuing blindly.
- Still need to wait for a particular application state or use an assertion that confirms the expected result.
- Avoid adding fixed sleeps like `time.sleep(3)` just to give the page time to load. They can make tests slower and still fail when the application takes longer than expected.

## 3. Locators – How Playwright Finds Elements

- In Selenium, we use `find_element()`, CSS selectors and XPath to locate elements.
- In Playwright, locators are the preferred way to find and interact with elements.
- A locator is not just a stored element reference. Playwright resolves it again when an action is performed, which helps when the page changes or re-renders.
- Prefer locators based on how a user sees the page instead of relying on the internal DOM structure.
- XPath is still supported, but it shouldn't automatically be first choice.
- Role-based locators are useful because they reflect how users and assistive technologies perceive elements.

## 4. Web-First Assertions

- Playwright provides built-in assertions through `expect()`.
- These assertions automatically retry until the expected condition is met or the assertion times out.
- This is useful when the UI needs some time to update after an action.
- Instead of checking immediately whether a message exists, I can assert that it becomes visible.
- Assertions should validate the outcome of the user action, not just confirm that the action was executed.

## 5. What to Keep from Selenium and What to Unlearn

### Keep These Habits

- Clear test cases and meaningful test coverage.
- Page Object Model (POM) and reusable components where they genuinely help.
- Test data management, configuration, logging and reporting.
- Independent tests and proper setup/teardown.
- CI integration, cross-browser validation and failure investigation.
- Assertions based on requirements and expected business outcomes.

### Habits to Rethink

- Adding explicit waits before almost every action.
- Using XPath for everything by default.
- Building custom wait utilities for situations Playwright already handles.
- Depending on test execution order or shared browser state.
- Rewriting every Selenium helper exactly as it was instead of using Playwright features.
- Using sleeps to fix flaky tests without understanding the underlying problem.

## 6. Practice selenium to palywright
- [Selenium](../python_exercises/tests/test_selenium_login.py)
- [Playwrigh](../typescript-exercises/ts-practice/tests/selenium-to-playwright.spec.ts)

## 7. Reflection
The automation fundamentals from selenium are still valuable though the implemntation might change. The habits most difficult to change would be manual timeouts and using locators instead of xpath or css. Also handling of complex scenarios like iframes and shadow dom are different as compared to selenium.