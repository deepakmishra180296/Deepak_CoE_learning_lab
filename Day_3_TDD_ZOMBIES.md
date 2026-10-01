# String Calculator - TDD & ZOMBIES


## TDD Implementation Journey — String Calculator

The String Calculator was developed incrementally using Test-Driven Development (TDD), following the **Red-Green-Refactor** cycle. Each requirement was introduced through a failing test, followed by the minimum production code required to make it pass, and subsequent refactoring.

## Implementation Steps

1. **Empty String Handling:** Started by writing a test to verify that an empty string returns `0`, without writing any production code beforehand.

2. **Initial Test Failure:** The test initially failed at the import stage because the production module was empty and did not contain the required implementation.

3. **First Implementation (Green):** Added the minimum production code to make the test pass, ensuring the method returned `0` instead of `None`.

4. **Single and Multiple Numbers:** Added tests for a single number, followed by two comma-separated numbers. Implemented the required addition logic to satisfy both scenarios.

5. **Multiple Numbers:** Added a test for calculating the sum of multiple comma-separated numbers. It passed immediately because the previous refactoring had already introduced logic capable of handling multiple values.

6. **Newline as a Delimiter:** Introduced a test to support both commas and newline characters as valid delimiters. The test initially failed with a `ValueError`, highlighting the need to handle multiple separators.

7. **Delimiter Handling:** Updated the implementation to support both delimiters, verified that the test passed, and refactored the code to maintain readability and avoid unnecessary complexity.

8. **Custom Delimiters:** Continued the same TDD cycle by introducing tests for custom delimiters, implementing the required parsing logic, and refactoring while preserving existing functionality.

9. **Negative Number Validation:** Added a test expecting a `ValueError` when negative numbers were provided. Initially, the calculator incorrectly included negative values in the sum instead of rejecting them.

10. **Negative Number Handling:** Implemented validation to detect negative numbers and raise a `ValueError` with an appropriate error message. Verified the behavior through the test suite.

## Key Learnings

- Practiced the Red-Green-Refactor cycle by introducing requirements through tests before implementing production code.
- Observed how refactoring can enable new requirements to pass without additional production changes.
- Used test failures to identify missing functionality and guide implementation.
- Improved code readability and maintainability through incremental refactoring.
- Ensured that new functionality did not break previously implemented behavior through regression testing.

## Applying ZOMBIES to the String Calculator

ZOMBIES is a scenario-selection guide. The letters stand for:

- **Z — Zero:** Start with the simplest or empty state. For this calculator, empty input returns `0`.
- **O — One:** Test the transition from no values to one value. For example, a single number is returned as its sum.
- **M — Many (or More complex):** Generalize from one value to multiple values, including combinations of supported delimiters and custom-delimiter cases.
- **B — Boundary behaviors:** Explicitly test edges and transitions. In this implementation, a number greater than `1000` is ignored. The boundary tests should cover `1000` (included) and a value just above it (ignored), as well as mixtures of eligible and ignored values.
- **I — Interface definition:** Let tests help shape the public behavior and interface—for example, the input format, delimiter handling, return value, and exception behavior. Keep the interface as simple as the requirements allow.
- **E — Exercise exceptional behavior:** Test invalid or exceptional inputs, including negative numbers, and verify the required exception and message.
- **S — Simple Scenarios, Simple Solutions:** Keep each test focused on one behavior and implement only enough production code to pass the current test. Avoid adding speculative complexity; refactor when the tests provide safety.


ZOMBIES is **not a rigid, strictly sequential checklist**. The article describes two dimensions: the Zero–One–Many progression helps order scenarios from simple to more complex, while Boundary behaviors, Interface definition, and Exceptional behavior are considerations throughout. Simple scenarios and simple solutions connect these dimensions.


## Key Learnings

- TDD provides the feedback loop; ZOMBIES provides a practical guide for selecting and ordering scenarios.
- Starting with simple cases helps establish the calculator's expected behavior before adding complexity.
- Boundary tests make edge rules explicit—for example, `1000` is within the accepted range while values greater than `1000` are ignored.
- Tests document both normal behavior and exceptional behavior, and regression runs protect previously implemented functionality.
- Simple tests and minimal implementations make the cause-and-effect relationship between a requirement and a code change easier to understand.

## Playwright ZOMBIES Example
An example of applying the ZOMBIES TDD methodology to UI testing using Playwright. Here is a short explanation of what was implemented:

- **Z (Zero)**: Checks the initial state by ensuring the login page loads with empty fields (`test_login_page_loads_correctly`).
- **O (One)**: Verifies the happy path for exactly one valid user logging in successfully (`test_one_user_valid_login_succeeds`).
- **M (Many)**: Uses data-driven tests (parameterization) to verify multiple different users (e.g., admin, guest) can log in and hit their respective routes (`test_many_users_login_routing`).
- **B (Boundaries)**: Tests the limits of the form by attempting to submit it entirely empty, verifying validation kicks in (`test_submit_empty_form`).