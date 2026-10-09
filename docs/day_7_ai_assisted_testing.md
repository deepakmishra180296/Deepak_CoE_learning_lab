# Day 7 – AI-Assisted Testing: Incubyte Approach

## 1. Incubyte BEE Plugin

### Short summary
BEE is an AI workflow engine/plugin for Claude Code that helps bring structure to software development. Instead of asking AI to directly write code, it guides the work through a defined process.

### Key points
- BEE follows a **spec-driven development** approach: understand the requirement before implementation.
- It uses **triage and specialist agents** so different tasks can be handled by focused agents.
- The workflow can cover context gathering, specification, architecture, implementation, testing, verification and review.
- BEE supports a more **repeatable and reviewable** way of working with AI.
- The goal is not simply to generate code, but to make the development process more structured.
- `@bee` annotations can be used to provide feedback during the workflow.

---

## 2. BEE Philosophy – Developer, Claude Code and BEE

A simple way to understand the relationship is:

> **Developer = Driver | Claude Code = Car | BEE = GPS**

- The **developer** decides where to go and what outcome is required.
- **Claude Code** provides the ability to perform coding and development actions.
- **BEE** provides guidance on the workflow and route to reach the desired outcome.
- AI should assist the developer rather than replace engineering judgment.
- The developer should review requirements, generated tests, implementation and final results.

### QA takeaway
AI can accelerate testing work, but the QA engineer remains responsible for deciding **what should be tested and whether the result is trustworthy**.

---

## 3. BEE Triage and Specialist Agents

### Short summary
BEE uses triage to understand the nature and complexity of a task before deciding how much process is required.

### Key points
- Not every task needs the same level of planning.
- Small changes can follow a lightweight workflow.
- Larger or higher-risk changes need more analysis and validation.
- Specialist agents can focus on specific responsibilities instead of one agent handling everything.
- Separating responsibilities helps make complex AI-assisted work more manageable.
- The approach reduces the tendency to immediately jump from requirement to code.

---

## 4. Incubyte Learn Plugin

### Short summary
The Learn plugin supports a structured learning workflow while working with Claude Code.

### Key points
- Learning can be organised into a guided workflow rather than only asking AI for explanations.
- It can help break a topic into smaller learning activities.
- AI can be used as a learning assistant instead of simply providing the final answer.
- A good learning workflow should encourage understanding, practice and verification.
- The learner should still think through the problem instead of blindly accepting AI-generated answers.

---

## 5. Prompt Engineering for QA

### Short summary
Good prompts are based on clear expectations, useful context and measurable outcomes. For QA, the prompt should explain what is being tested, what type of testing is required and what the expected output should contain.

### Key points
- Clearly define the **testing objective**.
- Provide relevant application, feature and business context.
- Specify constraints such as browser, framework, test level or test-data requirements.
- Ask for a specific output format.
- Use examples when they help demonstrate the expected quality.
- For complex prompts, separate instructions, context, examples and input clearly.
- Ask AI to identify assumptions instead of silently inventing information.
- Define success criteria before trying to improve the prompt.

### Useful prompt structure

`Role → Context → Testing objective → Constraints → Expected output → Examples → Verification`

### Example
Instead of:

> Generate test cases for login.

Use:

> Act as a QA engineer. Analyse the login feature for a web application. Cover positive, negative, boundary and security-related scenarios. Prioritise critical user journeys and return the scenarios in a table with priority and expected result.

---

## 6. When NOT to Use AI in Testing

AI is not the best choice for every testing activity.

### Avoid unnecessary AI when
- The test is simple and deterministic.
- A normal automation script is faster and more reliable.
- The expected result is already clearly defined.
- AI would introduce unnecessary complexity.
- The task requires exact, repeatable behaviour with no need for interpretation.
- The generated solution would be harder to maintain than a straightforward implementation.

### Important principle
> **Use AI where it adds value, not simply because AI is available.**

For deterministic regression tests, the final automated test should remain deterministic even if AI helped create it.

---

## 7. Human Review in AI-Assisted Testing

AI can generate test scenarios, test code and suggestions quickly, but QA judgment is still required.

A useful workflow is:

`Requirement → AI assistance → QA review → Execute tests → Verify result → Improve`

The QA engineer should check:
- Does the test represent a real requirement?
- Is the expected result correct?
- Are important edge cases covered?
- Is the assertion meaningful?
- Is the test independent and maintainable?
- Could the AI have made an assumption that is not supported by the application?

---

## 9. Overall Approach to AI-Assisted Testing

The main idea is not to replace developer with AI.

Instead:

- Use AI to reduce repetitive work.
- Give AI enough context to produce useful results.
- Use structured workflows instead of random prompting.
- Keep humans responsible for important decisions.
- Review and verify AI-generated tests.
- Prefer deterministic automation for deterministic behaviour.
- Measure the **quality of the final test suite**, not only how quickly AI generated it.

### Simple workflow

`Understand → Prompt → Generate → Review → Execute → Verify → Improve`

---

## 10. QA Code Review – AI-Generated Product Search Tests

**Review:** Waiting strategy and assertions are solid; locators, known-bug handling and a few coverage gaps need work.

### 1. Flakiness
- ✅ No `sleep` / `waitForTimeout`; all checks use auto-retrying `expect(...).toHaveCount / toHaveText`.
- ✅ Background waits for all 30 cards before each scenario, so there is no race on page load.
- ⚠️ **CSS-class locators** (`.search-keyword`, `.products .product`, `h4.product-name`, `.no-results h2`, steps L5-10) break on any markup or style change.
- ⚠️ **Hardcoded 30-item `CATALOG` + `CATALOG_SIZE`** (L12-45) duplicates data already in the feature file. If the catalog changes, many tests fail at once.
- ⚠️ **Order-sensitive assertions**: "exactly" also enforces DOM order (e.g. `Ca` → Cauliflower, Carrot, Capsicum, Cashews). A harmless re-sort would fail the tests.

### 2. Best practices
- ✅ Web-first assertions, `this: CustomWorld` typing, named constants, comments on every step.
- ❌ Prefer user-facing locators: `getByPlaceholder(...)`, `getByRole('button', { name: 'Search' })`.

### 3. Coverage gaps
- ❌ Not covered: pressing **Enter** to search, the search button with an empty or no-match term, and double or internal spaces (`Water  Melon`).
- ⚠️ Not covered: whether the search persists after Add to Cart or a page reload.
- ✅ Good: case-insensitivity, partial match, near-misses, regex characters, clear and replace flows.

---

## 11. Edge-Case Risk Register – Summary

**Full report:** [edge_case_risk_register.md](./edge_case_risk_register.md)

**What it is:** a list of edge cases the current practice suites don't exercise. The suites are Pytest + Playwright and GreenKart BDD (Cucumber + Playwright). Each risk is rated 🔴 High / 🟠 Medium / 🟢 Low and comes with a sample test.

**Scope:** it covers only untested cases, not positive paths or issues already in `test_suite_risk_analysis.md`.

### Key pointers
- **Input & boundary:**
  - Search is only ever tested through `fill()`, so paste, and autofill input is never exercised.
  - `{int}` quantity steps can't pass `1.5`, `abc` or `1e3`.
  - Other gaps: promo-code edge cases, hostile upload file names and sizes.
- **Async & timing:**
  - Playwright calls that don't wait (`count()`, `text_content()`, `is_visible()`) can read hidden or stale content.
  - Cucumber's 30s step timeout fires before Playwright's own 
  - Not tested: out-of-order responses, and navigating away mid-request.
- **State & DOM:**
  - `.first()` hiding duplicate elements.
