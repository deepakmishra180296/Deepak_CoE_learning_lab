# Day 3 – API Testing & Cross-Browser Coverage

## 1. Playwright Request Fixture and Direct API Testing

- Playwright provides a built-in `request` fixture that can send HTTP requests directly to an API.
- It follows configuration such as `baseURL` and additional HTTP headers, so we don't have to repeat all those details in every test.
- Using API calls is useful for checking server-side behaviour independently of browser interactions.
- API tests can also cover setup and cleanup. For example, create the required test data before running tests and remove it afterwards.
- Authentication state can also be reused between API requests and browser contexts, which helps avoid repeating the same login steps.

## 2. Combining API Calls with UI Assertions

- API and UI testing can work together in the same test flow.
- One approach is to create test data through an API, open the application in the browser and verify that the data appears correctly.
- Another approach is to perform an action through the UI and then check through the API whether the correct data was stored on the server.
- This avoids spending time on repeated UI setup when the main purpose of the test is to check another feature.
- UI assertions are still important because a successful API response does not guarantee that the information is displayed correctly.

## 3. Cross-Browser Testing – Chromium, Firefox and WebKit

- Playwright supports Chromium, Firefox and WebKit. It can also run tests against branded browsers such as Google Chrome and Microsoft Edge.
- A test passing in one browser does not automatically mean it will behave exactly the same in the others.
- Browser differences can affect layout, rendering, interactions and other browser-dependent behaviour.
- Playwright projects allow the same test suite to run with different browser configurations.

## 4. Accessibility Testing in Playwright

- Playwright supports accessibility checks with the `@axe-core/playwright` package.
- An accessibility scan can be added to an existing UI test or kept as a separate test.
- The scan can check a complete page or a specific section of the page.
- If a menu or another component appears only after an interaction, the page should first be moved to that state before running the accessibility scan.
- The scan results can be used in assertions to flag automatically detectable accessibility violations.
- Automated accessibility testing cannot catch every issue. Manual assessment is also important.

## 5. Reflection – Where API Testing Gives Faster Feedback

- API tests avoid browser startup, page navigation and UI interactions when those steps are not required for the check.
- They are useful for validating backend responses, preparing test data and checking application state.
- UI tests are still needed to validate visible behaviour and complete user journeys.
- Combining both can reduce duplicated setup and make test failures easier to understand.
- I should not try to test everything through the UI when a direct API check would be enough. At the same time, I should not replace important user-facing checks with API assertions.

## 6. Exercises

- Created an [api test](../typescript-exercises/api-test/tests/api-testing.spec.ts) to fetch a user details and verify it.
- Config the [Playwright Config](../typescript-exercises/api-test/playwright.config.ts) to include chrome, firefox and edge browser, so all the test in the `tests` folder are executed in all the three browsers.
- Used a demo api to test a login api and verified token in response body. [LOGIN API](../typescript-exercises/api-test/tests/api-login.spec.tss)