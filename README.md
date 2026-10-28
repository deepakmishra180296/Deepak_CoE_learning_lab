# Deepak's CoE Learning Lab

This is where I keep everything from my CoE training: daily notes, small exercises, and the test projects I built along the way. The focus is test automation with Playwright, in both Python and TypeScript, plus the habits around it (clean code, TDD, BDD, CI).

## What's in here

```
.
├── docs/                     Daily notes (day 1 to day 10) and a risk register
├── python_exercises/         Python + Playwright + pytest
│   ├── string_calculator/    String calculator kata (plain and ZOMBIES style)
│   └── tests/                All the pytest tests
├── typescript-exercises/
│   ├── ts-practice/          First Playwright Test (TypeScript) practice
│   ├── api-test/             API tests with Playwright's request context
│   ├── greenkart-bdd/        Cucumber + Playwright BDD tests for GreenKart
│   └── pom-design/           Page Object Model version of the GreenKart tests
└── .github/workflows/        CI pipeline (playwright.yml)
```

## The notes

Roughly one file per training day, in [docs/](docs/):

| Day | Topic |
|---|---|
| 1 | Incubyte core values, TypeScript + Playwright basics |
| 2 | Clean code, moving from Selenium to Playwright |
| 3 | TDD with ZOMBIES, API testing and cross-browser runs |
| 4 | Advanced UI automation (iframes, shadow DOM, drag and drop) |
| 5 | Test reliability (retries, flaky tests) |
| 6 | BDD and Gherkin |
| 7 | AI-assisted testing |
| 8 | CI/CD with GitHub Actions |
| 9 | Design patterns (Page Object Model) |
| 10 | Capstone review notes |

There's also an [edge case risk register](docs/edge_case_risk_register.md).

## Before you run anything

You'll need:

- Python 3.12 or newer
- Node.js 22 (what CI uses; newer should be fine)
- Internet access. Most tests hit public practice sites (rahulshettyacademy.com, the-internet.herokuapp.com, playwright.dev, etc.), so if one of those is down or slow, tests can fail for reasons that have nothing to do with the code.

All tests run headless, so no browser window will pop up.

## Running the Python tests

Set up once:

```bash
cd python_exercises
python -m venv .venv
source .venv/bin/activate        # on Windows: .venv\Scripts\activate
pip install -r requirements.txt
playwright install chromium
```

Run a test file or everything:

```bash
pytest tests/test_string_calculator.py     # one file
pytest tests/test_clean_code.py::test_user_can_purchase_filtered_products_with_promo_discount   # one test
pytest                                      # everything in tests/
```

`pytest.ini` already turns on traces, screenshots and videos for failures, and writes an HTML report to `python_exercises/report.html`. Failed-test artifacts land in `python_exercises/test-results/`.

A few tests are known to fail right now, so a plain `pytest` will not be fully green:

- `test_selenium_login.py` needs `selenium` installed, which isn't in `requirements.txt`.
- `test_playwright_login_zombies.py` points at `example.com/login`, which doesn't exist.
- `test_error_handling.py` looks for an element that example.com doesn't have. It fails on purpose to practise retries.
- `test_advance_ui_automation.py::test_shadow_dom` has a locator that matches two elements.

CI skips these on purpose. To mimic CI, ignore them:

```bash
pytest --ignore=tests/test_selenium_login.py \
       --ignore=tests/test_playwright_login_zombies.py \
       --ignore=tests/test_error_handling.py \
       --deselect tests/test_advance_ui_automation.py::test_shadow_dom
```

## Running the TypeScript tests

There are four separate projects, each with its own `package.json`. Install and run from inside the project folder.

### ts-practice and api-test (Playwright Test)

```bash
cd typescript-exercises/ts-practice      # or api-test
npm install
npx playwright install chromium
npx playwright test --project=chromium
npx playwright show-report               # open the HTML report afterwards
```

The configs also have firefox and webkit projects. Drop `--project=chromium` if you want all three (you'll need `npx playwright install` without the browser name).

### greenkart-bdd (Cucumber + Playwright)

```bash
cd typescript-exercises/greenkart-bdd
npm install
npx playwright install chromium
npm test                                  # all features
npm run test:cart                         # just the add-to-cart feature
npx cucumber-js features/checkout.feature # one feature file
```

The report goes to `reports/cucumber-report.html`. The full run is about 40 scenarios and takes around 3 minutes.

There's also a mutation testing setup with Stryker for the cart steps:

```bash
npm run stryker
```

This one is slow, because it re-runs the cart tests once per mutation.

### pom-design (Cucumber + Page Object Model)

```bash
cd typescript-exercises/pom-design
npm install
npx playwright install chromium
npm test
```

It's the same GreenKart site as above, but the steps go through page objects (`src/pages`) and components (`src/components`) instead of calling Playwright directly, with a small builder and factory for test data in `src/data`.

## CI

[.github/workflows/playwright.yml](.github/workflows/playwright.yml) runs on every push, and you can also trigger it by hand from the Actions tab. It has three jobs:

- **Python**: the passing pytest files, split into 3 shards.
- **TypeScript BDD**: `greenkart-bdd` and `pom-design` with Cucumber.
- **TypeScript Playwright Test**: `ts-practice` and `api-test` on chromium.

Each job uploads its report as an artifact, kept for 7 days.
