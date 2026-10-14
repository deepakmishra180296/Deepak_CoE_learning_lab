# Clean Code Practices and YAGNI

---

## 1. YAGNI — You Aren't Gonna Need It

### Core Principle
- **Build only what is required now**, not what you *think* might be needed in the future.

### Why Not Build for the Future?
- **Planning ahead is difficult, costly, and often wrong.** Agile methodology welcomes changing requirements, so we should build features *as and when* they are actually needed.
- **Cost of building:** Time and effort spent designing, building, and testing a feature that turns out to be useless right now.
- **Cost of delay:** Even if the assumption about a future feature turns out to be correct, working on it now delays the delivery of features that provide value today.
- **Cost of carry:** A speculative feature adds complexity to the codebase earlier than necessary, making the rest of the code harder to understand, modify, and maintain.
- **Cost of repair:** Requirements and our understanding of the problem keep evolving. We often realize that a pre-built feature was not built as it is eventually needed, so we accumulate the cost of reworking or refactoring it.

### What YAGNI Does *Not* Discourage
- **Refactoring, self-testing code, and Continuous Integration (CI)** align well with YAGNI. They are not "future features"; they keep the code simple, easy to understand, and easy to change, which is exactly what allows us to add features later only when needed.

---

## 2. Clean Code

### Why Clean Code Matters
- **Bad code slows future development.** It is difficult to refactor and reduces the team's pace as the codebase grows.
- **The redesign trap:** As productivity drops, teams eventually push for a complete redesign. The redesign itself takes a long time, and it struggles to keep pace with the continuously evolving old system.
- **It is the developers' responsibility.** Developers understand the risks of bad code better than anyone else, so they must defend code quality, even under deadline pressure.
- **Code without tests is not clean.** No matter how readable it looks, untested code cannot be safely changed.

### What Is Clean Code?
- **Clean code is code that has been taken care of.** Someone has taken the time to keep it simple and orderly.
- Key characteristics:
  - **No duplication**
  - **Does one thing** — each unit of code has a single, clear purpose.
  - **Expressiveness** — the code clearly communicates its intent.
  - **Tiny abstractions** — build things from small, well-named abstractions.
- **Readability makes writing easier.** There's no way to write code without reading it (developers read far more code than they write), so making code easy to read actually makes it easier to write.

### The Boy Scout Rule
- **Leave the campground cleaner than you found it.** Every time you touch code, improve it a little (rename a variable, split a long function, remove duplication). Small, continuous improvements prevent code from rotting over time.

---

## 3. Meaningful Names

- **Use intention-revealing names:** A name should tell *why* something exists, *what* it does, and *how* it is used, without needing a comment.
- **Avoid disinformation:** Don't use names that mislead (e.g., calling something `accountList` when it isn't a list) and avoid misspelled or confusingly similar names.
- **Make meaningful distinctions:** Names should mean something and be easy to distinguish from other names by their intent (avoid `data1`, `data2`, or noise words like `info`, `object`).
- **Use pronounceable names:** Names should be easy to say and spell, so they can be discussed naturally with teammates.
- **Use searchable names:** Avoid single letters and magic numbers that are hard to find in a codebase. **The length of a name should correspond to the size of its scope** — short names are fine for tiny local scopes; wider scopes need longer, more descriptive names.
- **Avoid encodings:** Don't embed type or scope information in names (e.g., Hungarian notation, `m_` member prefixes, `I` prefixes for interfaces). They add mental overhead and become misleading when types change.
- **Class names:** Classes and objects should have **noun or noun-phrase names** (e.g., `Customer`, `AddressParser`), not verbs.
- **Method names:** Methods should have **verb or verb-phrase names** (e.g., `save`, `deletePage`). Accessors, mutators, and predicates should be prefixed with `get`, `set`, and `is` respectively.
- **Pick one word per concept:** Be consistent. Don't use `fetch`, `retrieve`, and `get` interchangeably for the same kind of operation.
- **Use solution domain names:** Use well-known computer science terms, algorithm names, and pattern names (e.g., `JobQueue`, `AccountVisitor`), since the readers of the code are programmers.

---

## 4. Functions

- **Keep them small:** Functions should be short, and ideally even shorter than that.
- **Avoid deep nesting:** Functions should not contain nested statements; blocks inside `if`, `else`, and loops should ideally be a single line, often a call to another well-named function.
- **Do only one thing:** A function should do one thing, do it well, and do it only.
- **Use descriptive names:** A long descriptive name is better than a short cryptic one or a long explanatory comment.
- **Minimize arguments:** The fewer arguments the better (zero is ideal, then one, then two). More arguments make functions harder to understand and test.
- **Name them as verbs:** Function names should describe an action.
- **Command-Query Separation:** A function should either *do something* (command, changes state) or *answer something* (query, returns information), but not both.
- **Error handling is "one thing":** A function that handles errors should do nothing else. Prefer exceptions over error codes and extract `try/catch` bodies into their own functions.
- **Avoid duplication:** Every piece of knowledge or logic should have a single, authoritative representation in the codebase. Duplicated code means every change has to be made in multiple places, which increases the chance of bugs and inconsistencies.

---

## 6. Clean Code Checklist

Use this checklist while writing code (developers) or while reviewing and testing it (QA / reviewers).

### YAGNI and Scope
- [ ] The change implements only what the current requirement needs.
- [ ] No speculative features, hooks, or configuration options "for later".
- [ ] No unused code, commented-out code, or dead branches left behind.

### Naming
- [ ] Names reveal intent; the purpose is clear without reading a comment.
- [ ] No misleading, misspelled, or confusingly similar names.
- [ ] Names are pronounceable and searchable (no single letters outside tiny scopes, no magic numbers).
- [ ] Name length matches scope size.
- [ ] No encodings (type prefixes, `m_`, Hungarian notation).
- [ ] Classes use nouns; methods use verbs (`get` / `set` / `is` for accessors, mutators, and predicates).
- [ ] One word per concept is used consistently across the codebase.
- [ ] Solution-domain terms (patterns, algorithms) are used where they fit.

### Functions
- [ ] Each function is small and does exactly one thing.
- [ ] No deep nesting; blocks inside `if` / `else` / loops are short or extracted.
- [ ] Function names are descriptive verbs.
- [ ] Arguments are minimal (ideally 0 to 2); long argument lists are grouped into objects.
- [ ] Command-Query Separation: a function either changes state or returns data, not both.
- [ ] Error-handling functions do nothing else; exceptions are used instead of error codes.

### Duplication and Structure
- [ ] No duplicated logic (DRY); shared behavior is extracted into one place.
- [ ] Code is built from small, well-named abstractions.
- [ ] The code reads clearly from top to bottom and expresses its intent.

### Testing
- [ ] New or changed code is covered by unit tests.
- [ ] Tests are readable, fast, and independent of each other.
- [ ] All tests pass locally and in CI.

### Boy Scout Rule
- [ ] Code touched in this change was left cleaner than it was found (small refactors, better names, removed duplication).

---
## 7. Exercise: Refactoring a Complex Test into Clean Code (GreenKart with Playwright & Python)

This example demonstrates how to apply Day 2 Clean Code principles to end-to-end test automation.
 - **Unclean Code** - [python-exercise/tests/test_unclean_code.py](./python_exercises/tests/test_unclean_code.py)
 - **Clean Code** - [python-exercise/tests/test_clean_code.py](./python_exercises/tests/test_clean_code.py)

### What Changed and Why
- **Intention-Revealing Names** - Anyone reading the test name or failure report immediately understands the user journey.
- **No Magic Values** - Centralized values; changing the promo code or URL updates in exactly one place.
- **Small, Single-Purpose Functions** - Reusable across other tests; easy to maintain and test individually.
- **No Arbitrary Sleeps (Anti-Flake)** - Tests run significantly faster and poll automatically until elements appear or update.
- **Command-Query Separation** - Functions either query a locator or execute an action, not both.
- **No Swallowed Exceptions** - Test will fail loudly and accurately if the promo server or coupon fails.


## 8. Example: Error Handling - Playwright Test

The [example](../python_exercises/tests/test_error_handling.py) verifies that a web page contains a welcome message with proper exception handling. It only handles expected failure and preserves the test failure status.

**Notes:**
- The exception handler specifically catches AssertionError.
- We avoid catching unrelated exceptions unnecessarily.

## 9. When to Catch an Exception

Catch an exception when you can handle it meaningfully or add useful context.

- Catch specific exceptions instead of using a broad `Exception`.
- Handle expected failures, such as a missing configuration file or a recoverable API error.
- Use `try-except` only when you have a clear action to take.
- Avoid catching exceptions just to prevent the program from stopping.

## 10. Reflection: How Clean Code Connects to QA Craftsmanship

Clean code is an important part of QA craftsmanship because automation is not just about making tests pass, but also about making them reliable, readable, and easy to maintain. By following practices such as meaningful naming, keeping functions focused, avoiding duplication, and handling exceptions properly, I can build test scripts that clearly communicate the behavior being verified. I also learned that catching every exception is not good practice, as it can hide failures instead of helping identify the root cause. As a QA engineer, writing clean code helps me create trustworthy tests, debug failures faster, and make the automation framework easier for the entire team to understand and improve.
____

