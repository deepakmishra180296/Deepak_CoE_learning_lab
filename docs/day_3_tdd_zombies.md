# String Calculator - TDD & ZOMBIES


## TDD Implementation Journey — String Calculator

The String Calculator was developed incrementally using Test-Driven Development (TDD), following the **Red-Green-Refactor** cycle. Each requirement was introduced through a failing test, followed by the minimum production code required to make it pass, and subsequent refactoring.
[String Calculator](../python_exercises/string_calculator/string_calculator.py) 
[Test String Calculator (TDD)](../python_exercises/tests/test_string_calculator.py)

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
[String Calculator (ZOMBIES)](../python_exercises/string_calculator/string_calculator_zombies.py)
[Test String Calculator (ZOMBIES)](../python_exercises/tests/test_string_calculator_zombies.py)

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

## [Playwright ZOMBIES Example](../python_exercises/tests/test_playwright_login_zombies.py)
An example of applying the ZOMBIES TDD methodology to UI testing using Playwright. Here is a short explanation of what was implemented:

- **Z (Zero)**: Checks the initial state by ensuring the login page loads with empty fields (`test_login_page_loads_correctly`).
- **O (One)**: Verifies the happy path for exactly one valid user logging in successfully (`test_one_user_valid_login_succeeds`).
- **M (Many)**: Uses data-driven tests (parameterization) to verify multiple different users (e.g., admin, guest) can log in and hit their respective routes (`test_many_users_login_routing`).
- **B (Boundaries)**: Tests the limits of the form by attempting to submit it entirely empty, verifying validation kicks in (`test_submit_empty_form`).

___
# TDD & ZOMBIES

## Test Desiderata (Kent Beck) — Summary & Practical Pointers

Kent Beck identified **12 desirable properties** (desiderata) of automated software tests. His central observation is that **no test suite can maximize all 12 properties simultaneously**. Instead, every automated test involves deliberate trade-offs.

### The 12 Properties at a Glance

1. **Isolated:** Tests produce identical results regardless of execution order. No shared mutable state or leaky database entries.
2. **Composable:** Any arbitrary subset (1, 10, or 1,000) of tests can be executed together reliably.
3. **Fast:** Tests give near-instantaneous feedback. When suites become slow, developers run them less often, breaking the TDD flow.
4. **Inspiring:** A green test suite gives genuine confidence to deploy to production or perform major refactoring.
5. **Writable:** Writing a test has low cognitive and mechanical friction relative to the production code being written.
6. **Readable:** Tests act as clear, executable specifications. When a test fails, another developer can quickly understand the intent behind the test.
7. **Behavioral:** Tests are sensitive to actual changes in observable behavior. If behavior changes, the test must catch it.
8. **Structure-Insensitive:** Tests do *not* break when the internal implementation or architecture changes, provided external behavior stays constant.
9. **Automated:** Tests run completely without manual intervention or human interpretation.
10. **Specific:** When a test fails, the error message pinpoints the exact cause and location of the problem.
11. **Deterministic:** Flakiness is zero. If the code and environment haven't changed, the test outcome never flips between passes and failures.
12. **Predictive:** If all tests pass, the software is realistically ready for end-user production usage.

---


## Mocks Aren't Stubs (Martin Fowler) — Summary & Practical Pointers

**Mocks and stubs operate on fundamentally different verification mechanisms** and reflect two distinct philosophies of TDD.

- **Dummy:** Objects passed around merely to satisfy method signatures (e.g., filling required parameters) but never actually invoked.
- **Stub:** Objects that provide pre-programmed "canned answers" to calls during testing. Stubs feed data into the System Under Test (SUT) and do not cause tests to fail on their own.
- **Fake:** Objects with working business logic, but simplified so they are unsuitable for production (e.g., an in-memory repository or fake file system).
- **Mock:** Objects pre-programmed with *expectations*—specifying which methods must be called, with what arguments, and in what order. Mocks actively verify interactions and fail if calls deviate from expectations.
- **Spy:** A stub that additionally records outgoing interactions (e.g., counting calls or tracking passed arguments) for post-execution assertions.

### Pragmatic Rules of Thumb for Test Design

1. **Default to State Verification for Business Logic:** For algorithms, parsers, calculations, and domain entities (like our String Calculator), use real objects and state assertions.
2. **Reserve Stubs for External Inputs:** Use stubs to provide predictable external data (e.g., faking an HTTP response or clock timestamp).
3. **Use Mocks Sparingly at System Boundaries:** Mocks are best suited for verifying non-query actions on outward-facing boundaries where no observable state is left behind (e.g., verifying an email sender service was invoked with correct recipient and subject).
