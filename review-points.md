---
base: 04780a652bdfda877eed956087fb9f09845e9f86
audited-base: 04780a652bdfda877eed956087fb9f09845e9f86
audited-head: bc058f6a15c577133b02d6e276c155fb40242476
implementation: bc058f6a15c577133b02d6e276c155fb40242476
head: bc058f6a15c577133b02d6e276c155fb40242476
reviewers: 4 read-only opus subagents (correctness, security, ticket-fit, tests); CI green
harness: claude-code
session: 0e61b27d-b0fe-4940-8edd-41151fce16ab
fixed-in: HEAD
anchors: review-commit
---

## Fixed

### Locators navigation test never asserted the destination page's content
- file: typescript-exercises/ts-practice/tests/practice.spec.ts:13
- file: typescript-exercises/ts-practice/tests/practice.spec.ts:14
- source: tests reviewer
- severity: medium
- observation: Only the URL was checked, so a GitHub Pages 404 at locators.html would still pass. The real page has a "Locators | PlayLab" title and a `loc-title` heading that went unchecked.
- fix: Assert the destination title and the `loc-title` heading are visible.

### Unanchored URL regex matched wrong destinations such as old-locators.html
- file: typescript-exercises/ts-practice/tests/practice.spec.ts:12
- source: tests reviewer
- severity: low
- observation: `/locators\.html/` also matches `old-locators.html` or `?next=locators.html`, so a broken link could stay green.
- fix: Anchor the pattern as `/\/locators\.html$/`.

## Ignored

### Homepage title check `/PlayLab/` is loose
- file: typescript-exercises/ts-practice/tests/practice.spec.ts:10
- source: tests reviewer
- severity: low
- observation: Every PlayLab page carries that title, so it cannot prove the homepage itself loaded.
- why: The next step clicks a homepage-only nav link, which already fails on any other page.

### Test depends on a live third-party site
- file: typescript-exercises/ts-practice/tests/practice.spec.ts:9
- source: tests reviewer
- severity: low
- observation: With local retries at 0, a network blip or site redesign fails the test on all three browsers.
- why: The ticket asked for a test against that site; mocking it would defeat the purpose.

## Assumptions

### Chose a nav-click-to-Locators flow as "one more test"
- file: typescript-exercises/ts-practice/tests/practice.spec.ts:11
- why: The ticket named only the site; nav to Locators is the most stable testid-based interaction, but any other flow would also fit.
- alternative: A title-only smoke test mirroring the existing playwright.dev test.
- confidence: 0.6
