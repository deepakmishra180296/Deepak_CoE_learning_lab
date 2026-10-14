# Day 9 – Page Object Model Depth & Framework Architecture

## 1. Design Patterns Relevant to Day 9 – Refactoring.Guru

**Summary:** Factory Method and Builder are creational patterns. They help create objects without spreading object-construction details throughout the code.

- **Factory / Factory Method:** Keep common object creation in one place. For test automation, a `TestDataFactory` can return test data with sensible defaults and allow selected values to be overridden.
- **Builder:** Useful when an object has many fields or optional combinations. Build the object step by step so the test data setup stays readable.
- **Difference:** A factory is useful for common ready-to-use data; a builder is useful when a test needs more control over how a complex object is assembled.
- Use either pattern only when it reduces duplication or makes test data easier to understand.

## 2. Page Object – Martin Fowler

**Summary:** A Page Object wraps a web page or a meaningful part of its UI in an application-specific API. Test code calls clear methods instead of dealing directly with DOM details and low-level browser interactions.

- Keep locators and UI interaction mechanics inside the page object. If a selector changes, I should usually need to update one place.
- Prefer action-oriented methods such as `searchProduct()` or `openCart()` over exposing raw selectors to the test.
- A page object does not have to represent one whole browser page. A meaningful section such as a header, list, or panel can be represented separately.
- Keep test-specific assertions in the test/step-definition layer in most cases. Page objects should provide actions and page state without becoming bloated.
- With Cucumber, Gherkin steps should describe behavior and call page-object methods rather than contain direct Playwright selectors and interactions.

## 3. Page Object Models – Playwright

**Summary:** Playwright's POM approach organizes repeated page interactions into reusable classes with a higher-level API. This helps keep tests focused on what is being tested rather than how the UI is operated.

- Pass Playwright's `Page` instance into the page-object constructor and define the relevant locators there.
- Keep page-specific actions in the page object and expose methods that communicate intent clearly.
- Reuse the same page-object methods across scenarios instead of repeating selectors and click/fill logic.
- Separate responsibilities: page objects handle UI interaction; tests or step definitions handle scenario flow and expected-result assertions.
- Keep classes focused. Shared UI sections can be separate component objects and composed into page objects when that avoids duplicated code.

## 4. Fixtures – Playwright Test

**Summary:** Fixtures prepare the dependencies a test needs and manage their setup and cleanup. Playwright Test includes built-in fixtures and supports custom, typed, reusable fixtures.

- Common built-in fixtures include `page`, `context`, and `browser`. A page is associated with an isolated browser context; browser resources can be reused to make execution more efficient.
- Fixtures are created when needed, can depend on other fixtures, and keep setup/teardown logic in one place.
- **Test-scoped fixtures** are created and cleaned up for each test. **Worker-scoped fixtures** are shared by tests running in the same worker and cleaned up when that worker ends.
- Fixtures are used for lifecycle, dependency setup, isolation, and cleanup. Use page objects to encapsulate UI locators and behavior.

## 5. Component-Based Page Object Model (COM)

**Summary:** Instead of putting every locator on a page into one giant page object, we break down reusable sections of the UI (like a header, cart preview drawer, or product card) into independent component objects. Page objects then compose these components.

- **Composition over inheritance:** `HomePage` and `CheckoutPage` both include a `header` instance instead of re-writing cart icon and navigation selectors.
- **Single responsibility:** If the header layout changes, we only touch `HeaderComponent.ts`.
- **Cleaner tests:** Tests can interact with components naturally (e.g. `homePage.header.openCartPreview()`).

## 6. Hands-on Exercise Implementation Notes

**Summary:** We implemented a POM desgin (`typescript-exercises/pom-design`) using native Playwright Test to practice these architectural patterns with zero BDD overhead.

- **Base Page Class (`BasePage.ts`):**
  - **What belongs:** Generic low-level utilities — wait helpers (`waitForElement`, `waitForUrl`), contextual logging (`log`, `logError`), and error capture (`safeAction`).
  - **What does not belong:** Page-specific locators, business actions (e.g. checkout, search), and test assertions (`expect`).
  - **Error capture:** The `safeAction` helper wraps async actions in a `try/catch`, logs the exact action failure with context, and re-throws the error so tests fail cleanly.
- **Test Data Management (Builder + Factory):**
  - **Builder (`ProductBuilder.ts`):** Assembles complex test objects step-by-step with chainable methods (`withName`, `withQuantity`, `withPrice`).
  - **Factory (`TestDataFactory.ts`):** Provides instant, sensible presets (`createDefaultProduct()`, `createCarrot()`) so tests don't hardcode data strings.
- **Test Isolation:** 2 independent tests covering Home Page cart preview and Checkout order summary without shared mutable state.

## Key Takeaways

- Keep selectors and UI interactions out of step definitions; use focused page objects and reusable components.
- Avoid bloated page objects, duplicated selectors, shared mutable scenario state, and unnecessary inheritance.
- Use a base page only for genuinely common page-level utilities; keep business workflows in their relevant page objects.
- Keep lifecycle/setup/cleanup separate from UI behavior: fixtures or Cucumber World/hooks manage lifecycle, while page objects manage UI actions.
- Use a factory for standard test data and a builder when complex data needs to be assembled in steps.
- Apply patterns only when they make the framework easier to read, test, and maintain.

## How to Run the Tests

To run the test suite:

1. Open your terminal and navigate to the directory:
   ```bash
   cd typescript-exercises/pom-design
   ```
2. Install dependencies (first time only):
   ```bash
   npm install
   ```
3. Run both tests (headless):
   ```bash
   npm test
   ```
4. Optional execution modes:
   - Run headed (watch browser execution): `npm run test:headed`
