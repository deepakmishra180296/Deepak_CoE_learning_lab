# Day 1 — TypeScript for Python Automation Engineers

## 1. TypeScript fundamentals: coming from Python

### Summary
TypeScript is JavaScript with a type system added on top. It can infer many types from assigned values, so I do not need to annotate every variable, but I can add types when they make the code clearer or prevent mistakes. The main benefit is catching some mistakes while writing the code instead of waiting for the test to run.

### Key notes
- Common types include `string`, `number`, `boolean`, arrays, and object types.
- TypeScript can infer a type from a value, for example `const userName = "Deepak"` is understood as a string.
- `any` disables much of the checking for that value, so should be avoided unless there is a reason.

## 2. Interfaces and the module system

### Summary
An interface gives a name to the shape of an object, which is handy when several tests or helpers use the same data. Modules help keep a project split into files, so shared types and functions can be imported where they are needed instead of being copied around.

### Key notes
- Define a shared data shape once and reuse it for test data, function parameters, or return values.
- Keep related code in separate files, for example test data, page objects, and test specs.

## 3. Why TypeScript is useful in Playwright frameworks

### Summary
The TypeScript Handbook explains that type checking can catch unexpected code usage, while the Playwright introduction uses TypeScript as the default project option. The editor can offer better suggestions, and type errors can be caught before running the suite.

### Key notes
- The editor can suggest Playwright methods and help show which arguments a method expects.
- Types can catch certain mistakes in test code, such as passing a value of the wrong type to a function.
- Types make code easier to navigate, but they do not replace assertions or checking the application behaviour.

## 4. `async` and `await` in TypeScript compared with synchronous Python tests

### Summary
In JavaScript and TypeScript, an `async` function always returns a Promise. `await` pauses that function until the Promise settles and gives back its result, which makes asynchronous steps read in a top-to-bottom order.

### Key notes
- Put `async` before a function when it needs to use `await`.
- `await` can only be used inside an `async` function, apart from supported top-level module cases.
- An awaited Promise can resolve with a value or reject with an error.
- Use normal `try/catch` when I need to handle an error around awaited work; an unhandled rejection can become an error that is easy to miss.
- In synchronous Python Playwright code, calls may look more direct. TypeScript's async style makes waiting explicit in the test.

## 5. Python automation snippet into TypeScript
- [Python example](../python_exercises/tests/test_practice.py)
- [TS example](../typescript-exercises/ts-practice/tests/practice.spec.ts)


- The TypeScript test imports `test` and `expect` from Playwright Test.
- The test callback is `async`, and the navigation is awaited.
- The assertion uses Playwright's `expect` API rather than a plain Python `assert` statement.

## 6. Playwright TypeScript project and sample test

### Summary
The Playwright introduction provides a project initializer that creates a starter test and configuration. This is a useful way to get a working baseline before changing the project structure or adding tests of my own.

### Key notes
1. Start a project with:

   ```bash
   npm init playwright@latest
   ```
2. The generated project includes a `playwright.config.ts`, `package.json`, lock file, and a starter test such as `tests/example.spec.ts`.
3. Run the tests:

   ```bash
   npx playwright test
   ```

## 7. Reflection: what feels familiar and what feels different

### What feels familiar
- The overall test flow is still recognizable: navigate to a page, interact with it, and assert the result.
- Functions, objects, classes, and reusable helpers are concepts I already know from Python.

### What feels different
- I need to pay more attention to syntax, types and interfaces.
- The `async`/`await` style is more visible in TypeScript Playwright tests than in synchronous Python tests.
- A test can have valid TypeScript types and still fail because the page content, locator, or expected behaviour is wrong.
- It feels like a python coding style and c++ synatax mix together.
