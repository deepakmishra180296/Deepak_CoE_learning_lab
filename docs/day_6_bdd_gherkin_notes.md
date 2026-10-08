# Day 6 – BDD, Gherkin & Acceptance Testing Notes

## 1. Gherkin Principles and Syntax

Gherkin uses keywords to give structure and meaning to executable specifications.

### Core structure

- **Feature** – high-level description of a feature and a group of related scenarios.
- **Scenario / Example** – a concrete example that illustrates a business rule.
- **Given** – describes the initial context or precondition.
- **When** – describes an event or action.
- **Then** – describes the expected, observable outcome.
- **And / But** – used to make consecutive steps easier to read.

A good scenario follows the basic flow:

```text
Given → initial context
When  → event/action
Then  → expected result
```

### Important Gherkin constructs

- **Background** – useful when the same `Given` context is repeated across scenarios.
- **Scenario Outline** – useful when the same scenario needs to run with different values.
- **Examples** – provides the values used by a Scenario Outline.
- **Tags** – can be used to group related features/scenarios.

### Key points

- Gherkin examples are both documentation and tests.
- Keep scenarios around **3–5 steps** where possible.

---

## 2. Writing Effective Gherkin

The main idea is to describe **behaviour**, not implementation.

### What vs How

Good Gherkin explains **what the user/system should achieve**.

Bad Gherkin describes the exact process used to achieve it, such as:

- entering values into specific fields
- clicking a particular button

The implementation can change while the intended behaviour remains the same.

### Declarative style

A declarative scenario focuses on the capability or outcome instead of the mechanics.

Benefits mentioned in the article:

- Less brittle
- Easier to maintain
- Easier to read
- Better as living documentation
- Less affected by UI or implementation changes

---

## 3. Keeping Scenarios BRIEF

The article gives **BRIEF** as six principles for writing better scenarios.

### B – Business language
- Use language from the business/domain.
- Terms should be clear and unambiguous to business people.
- Avoid words that can mean different things in different contexts.

### R – Real data
- Use concrete, real data when it helps reveal intent.
- Real examples can expose boundary conditions and assumptions early.

### I – Intention revealing
- The scenario name should reveal the intention.
- Each line should describe intent rather than mechanics.

### E – Essential
- Keep only the details needed to illustrate the rule.
- Remove incidental details.

### F – Focused
- Most scenarios should illustrate a single rule.
- A scenario should not fail because of an unrelated rule changing.

---

## 4. Three Amigos

Three Amigos brings together different perspectives before, during and after development.

### Three perspectives

- **Business** – What problem are we trying to solve?
- **Development** – How might we build the solution?
- **Testing** – What could possibly happen?

The people with these perspectives collaborate to:

- define what should be done
- agree on how they know it is done correctly
- create a clearer description of the work, often through examples

### Why it is useful

- Builds shared understanding of the intent.
- Finds misunderstandings and confusion early.
- Allows learning to happen earlier.
- Keeps the discussion focused on the necessary perspectives.


---

## 5. Living Documentation and Executable Specification

Gherkin scenarios can act as **living documentation** because they describe the intended behaviour in a form that can also be executed.

The articles connect this idea with good scenario writing:

- Behaviour-focused scenarios remain useful even when implementation changes.
- Declarative scenarios are easier to read as living documentation.
- Examples serve as executable specifications of the system.
- Scenarios should communicate business intent clearly rather than UI mechanics.

The goal is to keep the documented behaviour useful to both the delivery team and business stakeholders.

---

## 6. Quick Checklist – Good Gherkin

Before finalising a scenario, check:

- [ ] Does the scenario describe business behaviour, not implementation?

- [ ] Is the scenario written in clear business/domain language?

- [ ] Does the scenario have a clear Given → When → Then flow?

- [ ] Does the scenario reveal its intent?

- [ ] Are UI details, selectors, URLs and technical steps avoided?

- [ ] Is every step essential to the behaviour being described?

- [ ] Does the scenario focus on one rule or behaviour?

- [ ] Is the expected result observable and clear?

- [ ] Is the scenario short and easy to understand?

- [ ] Would the scenario still make sense if the underlying implementation changed?

- [ ] Could a business person, developer and tester understand the scenario in the same way?

## 7. GreenKart BDD Project

This is a practical example of the above principles inside the `typescript-exercises/greenkart-bdd` folder. This project automates the [GreenKart](https://rahulshettyacademy.com/seleniumPractise/#/) e-commerce site using **Cucumber**, **TypeScript**, and **Playwright**.

### How to Run the Tests
1. Open your terminal and navigate into the folder: `cd typescript-exercises/greenkart-bdd`
2. Run the tests using the command: `npx cucumber-js`

### What is inside?
- **Feature Files (`/features`)**: These contain the plain-English Gherkin scenarios (like searching for a product, adding to the cart, and checking out). They act as our readable living documentation.
- **Step Definitions (`/steps`)**: The actual TypeScript code that links each Gherkin sentence to a Playwright action. For example, when the feature says "I search for Cucumber", the step definition tells Playwright to type "Cucumber" into the search box.
- **Hooks (`/support/hooks.ts`)**: This code runs automatically before and after your scenarios. It sets up a fresh, invisible browser page for every test so that they remain perfectly isolated from each other.

*Note: One of our scenarios explicitly tests what happens when you try to add a product with a negative quantity. GreenKart currently has a bug that allows this, which means that specific test will fail—exactly as a good test should when catching a real bug!*
