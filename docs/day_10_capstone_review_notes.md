# Day 10 — Capstone Review & Reflection

## 1. Test Pyramid vs. Testing Trophy

### Practical Test Pyramid

**Summary:** Use different levels of test granularity, with many fast, focused tests and fewer broad end-to-end tests.

- **Unit tests:** Narrow scope and fast feedback; cover business rules and edge cases.
- **Integration/service tests:** Check that multiple units or dependencies work together.
- **UI/end-to-end tests:** Validate important behavior through the real user-facing flow; keep these fewer because they usually take longer and can be more expensive to maintain.
- Push checks down to the lowest level that gives reliable confidence. Keep higher-level tests when they verify something lower-level tests cannot, such as the actual integration or complete user journey.
- Avoid a test “ice-cream cone” with too many slow UI tests and too few lower-level checks.

### Testing Trophy

**Summary:** The Testing Trophy puts emphasis on integration tests for JavaScript/front-end applications, alongside static analysis, unit tests, and end-to-end tests.

- **Static checks:** Catch certain issues before runtime, such as type and lint errors.
- **Unit tests:** Check focused logic in an isolated unit.
- **Integration tests:** Verify connected units working together; often provide a strong balance of realism and maintenance cost for front-end behavior.
- **End-to-end tests:** Validate a real user journey with as little mocking as practical.
- The Trophy is a guide to return on investment, not a mandatory ratio for every project. The useful test mix depends on the codebase and risks.

### My Current Choice

For the GreenKart BDD suite, browser-based end-to-end tests are useful for validating product search, cart, and checkout journeys. However, they should not be the only layer in a production-sized application. I would keep a small set of critical browser flows and put detailed rules and edge cases into faster unit or integration tests wherever the code and test interfaces allow it. The Pyramid is a practical overall portfolio guide; the Trophy is especially useful when deciding how much integration testing a front-end codebase needs.

## 2. Mutation Testing

**Summary:** Mutation testing checks how well tests detect small, deliberate changes to the application code. It tests the tests, rather than simply measuring how much code they execute.

- A **mutant** is a small change such as reversing a condition, changing an operator, altering a return value, or removing a statement.
- A **killed mutant** causes one or more tests to fail, showing that the test suite detected the change.
- A **surviving mutant** does not cause a test failure. It may reveal a missing assertion, an uncovered behavior, or a weak test.
- Review surviving mutants and add or improve tests only where the behavior matters.
- Some mutants may be equivalent to the original behavior or unreachable, so not every survivor represents a genuine test gap.
- Code coverage shows which code ran; mutation testing gives additional evidence about whether tests would notice certain faults.

## 3. Stryker Mutator for TypeScript

**Summary:** StrykerJS is an open-source mutation testing tool for JavaScript and TypeScript. It creates mutants, runs the configured test suite, and reports which changes were detected by tests.

- Stryker supports multiple mutation types, test-runner integrations, parallel workers, and reports for surviving mutants.
- The Node.js guide supports ahead-of-time and just-in-time transpilation, but recommends avoiding repeated just-in-time compilation where possible because mutation testing runs many iterations.
- Mutation testing can take longer than ordinary tests, so it is most useful when focused on code where test quality matters.
___

## 4. Review Against Day 2 Clean Code Checklist

### 4.1 Naming & Intent
- **Raw DOM Selectors:** Selectors like `.cart-info table tr nth(0) strong` and `.cart-preview .cart-item` obscure business meaning.
- **Vague Step Names:** Step names describe UI mechanics (`I view my cart`) rather than user intent (`I open the shopping cart`).

### 4.2 Functions & Single Responsibility
- **Multiple Responsibilities in Steps:** A single step (`Then '{string} should be included in my cart'`) opens the drawer, locates items, and performs visibility checks.
- **Command-Query Separation (CQS):** Clicks (commands modifying UI state) and assertions (queries checking state) are combined in verification steps.

### 4.3 Duplication & Structure (DRY)
- **Repeated Cart Icon Clicks:** `.cart-icon img` click logic is repeated across 4 separate step definitions.
- **Duplicated Item Count Selector:** `.cart-info table tr` hierarchy is duplicated in `add_to_cart_steps.ts` and `checkout_steps.ts`.

### 4.4 Testing & Boy Scout Rule
- **Quick Fix Patches:** Use of `.first()` in `.empty-cart h2.first()` patched a Playwright strict-mode error instead of fixing locator specificity.

---

## 5. Review of `add_to_cart.ts`

Reviewing [`typescript-exercises/greenkart-bdd/steps/add_to_cart_steps.ts`](../typescript-exercises/greenkart-bdd/steps/add_to_cart_steps.ts).

### 5.1 Day 2 Clean Code Findings
- **Magic Indexing:** `.nth(0)` and `.nth(1)` used for header tables—brittle if table row order changes.
- **No Error Handling:** No try/catch or failure logging to explain why an element wait timed out.

### 5.2 Day 3 ZOMBIES Coverage Review

| ZOMBIES Principle | Current Status | QA Finding & What to Fix |
| :--- | :--- | :--- |
| **Z – Zero** | Covered | Checks empty cart count (`0`).
| **O – One** | Covered | Adds 1 product (`Cucumber`).
| **M – Many** | **Missing** | No test adding multiple distinct products or multiple quantities of the same item to test cumulative badge and cart total. |
| **B – Boundary** | **Weak** | Tests `-1` quantity, but misses boundaries: `0`, extreme numbers (`999`), and non-numeric inputs (`abc`). |
| **I – Interface** | Flawed | Step says `with a quantity of -1`, coupling scenario to UI input format rather than business rule. |
| **E – Exceptional** | **Critical Defect** | Scenario `Add a product to the cart with invalid quantity` contains no real assertion—passes falsely despite GreenKart not validating `-1`. |
| **S – Simple Scenarios** | Mixed | Scenarios are short, but mix drawer-opening mechanics with state assertions. |

### Peer Review
- Implemntation of POM instead of passing locators in the script.
- Test should not have custom behaviour as it would be difficult to maintain.
- Comment should be present only when necessary.
- Locators should be dynamic instead of index based.

---

## 6. Test Strategy: Apply Discount Coupon at Checkout

### 6.1 Feature Overview

**Feature:** Apply a discount coupon during checkout.

**Objective:** Allow customers to apply a valid coupon code to their cart and receive the correct discount before placing an order.

**Assumptions:**
- Coupons may be valid, expired, invalid, or restricted to specific products.
- The order summary displays the subtotal, discount, and final payable amount.
- A customer can remove an applied coupon before placing the order.

#### 6.2 What to Automate

Automation will focus on repeatable, high-value scenarios that are likely to be executed frequently.

- **Happy path:** Apply a valid coupon and verify the discount and final amount.
- **Invalid coupon:** Verify that an appropriate error message appears.
- **Expired coupon:** Ensure an expired coupon cannot be applied.
- **Boundary conditions:** Verify minimum purchase requirements and maximum discount limits.
- **Coupon removal:** Remove an applied coupon and verify that the original total is restored.
- **Regression:** Verify that cart items, quantities, and checkout functionality remain unaffected.
- **API or business logic tests:** Validate discount calculations and coupon eligibility at the appropriate lower testing layer, if the application exposes these independently.

**Approach:**
- Cover business rules with fast unit or API tests wherever possible.
- Use Playwright for critical end-to-end checkout workflows.

### 6.3 What to Test Manually

Manual testing will focus on areas that require human judgment or exploratory investigation.

- **Usability:** Check whether applying a coupon is intuitive and easy to understand.
- **Error messages:** Ensure messages are clear and helpful for invalid or expired coupons.
- **Visual presentation:** Verify that discounts, totals, and error messages are displayed correctly.
- **Exploratory testing:** Try unusual sequences, such as changing cart quantities after applying a coupon.
- **Accessibility:** Check keyboard navigation, focus behavior, and screen-reader labels.
- **Responsive behavior:** Check the checkout experience on different screen sizes.

Manual testing is useful for discovering unexpected behavior and evaluating aspects that are difficult to express as deterministic assertions.

### 6.4 What Not to Test and Why

- **Third-party payment gateway internals:** These are outside the feature's ownership. Can verify the application's integration using a sandbox or suitable contract tests instead.
- **Every possible coupon combination:** Exhaustive combinations can become expensive. Prioritize high-risk rules, boundaries, and representative combinations.
- **Unstable external services in routine tests:** Avoid depending on live third-party services when controlled test doubles or sandbox environments provide more reliable validation.

These exclusions reduce maintenance and execution time without ignoring important integration risks.

### 6.5 Test Execution Strategy

- Run unit tests on every relevant code change.
- Run API and integration tests in CI to validate coupon rules and service interactions.
- Investigate failures using test reports, screenshots, and Playwright traces.
- Keep test data isolated so one test cannot affect another.


## 7. How to Run Stryker

To run mutation testing on `add_to_cart_steps.ts`:

1. Navigate to the `greenkart-bdd` directory:
   ```bash
   cd typescript-exercises/greenkart-bdd
   ```

2. Run Stryker using npm:
   ```bash
   npm run stryker:cart
   ```

3. View the generated mutation report:
   Open `reports/mutation/mutation.html` in your browser to see surviving vs killed mutants with interactive diff views.



## 8. Ten-Day Learning Reflection

Over these ten days, my focus has expanded from writing individual automation scripts to building tests that are readable, isolated, resilient, and maintainable. I have worked with clean-code practices, test design using ZOMBIES, Playwright reliability and isolation, BDD, POM and reusable components, test data design, and CI reporting and execution.

The main takeaway is that a passing test is not automatically a useful test. It needs to check the right behavior, fail for the right reason, and give enough information to debug a failure. I also need to choose the correct test level instead of relying only on browser automation. My next focus is to improve framework design judgment, write clearer assertions, get more practice with CI configuration, and use mutation testing to find gaps that ordinary coverage can miss.


## Changes after review

- 2026-10-28: Declared locators once per file in a `locators` object in the four `greenkart-bdd` step files (`add_to_cart`, `checkout`, `search`, `product_search_coverage`) to remove duplication.
- 2026-10-28: Replaced index-based locators (`.nth()` on cart rows, `.cart-icon img`, `td.nth(4)`) with label-, role- and class-based ones, and swapped manual index loops for `allTextContents()`, so steps survive layout changes. Only the 3 pre-existing failing scenarios remain (known invalid-quantity bug and two whitespace-search scenarios).
