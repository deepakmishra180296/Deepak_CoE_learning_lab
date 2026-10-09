# Edge-Case Risk Register — What the Practice Suites Don't Exercise

**Date:** 2026-10-09
**Scope:** `tests/` + root Python tests (Pytest + Playwright, sync API) and `typescript-exercises/greenkart-bdd` (Cucumber + Playwright)
**Apps under test:** GreenKart (`rahulshettyacademy.com/seleniumPractise`), Sauce Demo (`sauce-demo.myshopify.com`), the-internet (`the-internet.herokuapp.com`)

> **Note on stack:** the brief says Python uses *Selenium*. The Python tests here actually use **Playwright** (`playwright.sync_api`). The only "selenium" matches in the repo are the GreenKart URL path. Everything below assumes Playwright. Where a Selenium habit (implicit waits, stale elements) causes a Playwright-specific trap, I point it out.

**Out of scope on purpose:** positive paths and basic functionality, plus anything already in [`test_suite_risk_analysis.md`](./test_suite_risk_analysis.md) (vacuous asserts, collection problems, retry policy, missing artifacts). This report only covers **cases nobody tests**.

**Legend:** 🔴 High · 🟠 Medium · 🟢 Low. **⚠ verify** = the selector, endpoint or app behaviour needs checking in DevTools before you rely on it. The *risk* still holds either way.

---

## Risk Heat Map

| Flow | Input & Boundary | Async / Timing | State & DOM |
|---|---|---|---|
| GreenKart search | 🟠 Unicode, invisible chars, JS-coercion strings, 100k input | 🔴 input path that skips keyup (paste/IME/autofill) | 🟢 focus loss |
| GreenKart add-to-cart / quantity | 🔴 ± buttons below 1, `{int}` can't express bad input | 🟠 button text flips to "ADDED" | 🟠 hidden duplicate elements, `.first()` |
| GreenKart cart → checkout → order | 🟠 promo code boundaries | 🔴 confirmation shown only briefly before auto-redirect; navigating away mid-promo | 🔴 deep-link/refresh into `#/cart` and `#/country` with empty state; terms not accepted |
| Sauce Demo cart | 🟢 qty field 0 / negative | 🟠 out-of-order responses | 🔴 two tabs, one session; cookies cleared mid-flow; overlays |
| the-internet login | 🟠 homoglyph / emoji / null byte | — | 🔴 session loss, logout + back |
| the-internet upload | 🔴 path-traversal name, NFD filename, oversize | 🟠 server 5xx not asserted | — |
| the-internet DnD / checkbox / iframe / shadow | — | 🟢 iframe reloading mid-test | 🟠 `check()` hides toggle bugs, drop on self, Firefox form restore |
| Test infrastructure (both) | — | 🔴 Playwright APIs that **don't** wait; Cucumber timeout fires before Playwright's | 🔴 dialogs auto-dismissed without trace |

---

## 1. Input & Boundary Anomalies

### 1.1 🔴 Search only tested through `fill()`. Paste, IME and autofill paths never run.

**Gap:** every search step uses `locator.fill()`, which fires one `input` event. Real users also **paste** (input, no key events), type through an **IME** (composition events; Japanese/Chinese/Hindi keyboards), or let **browser autofill** fill the box. If GreenKart filters on `keyup` instead of `input`, those users see no filtering, and the suite would never notice.

**Why it's missed:** practice suites copy the first input method that works.

```ts
// steps/search_input_methods_steps.ts
When('I insert {string} into the product search without key events', async function (this: CustomWorld, term: string) {
    await this.page.locator('.search-keyword').focus();
    await this.page.keyboard.insertText(term);          // input event only — mimics paste / IME commit
});

When('I paste {string} into the product search', async function (this: CustomWorld, term: string) {
    await this.page.locator('.search-keyword').evaluate((el: HTMLInputElement, text) => {
        const data = new DataTransfer();
        data.setData('text/plain', text);
        el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true }));
        el.value = text;
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }, term);
});
```
```gherkin
@search @edge
Scenario Outline: Search filters regardless of how text is entered
  When I <method> "Tomato" into the product search<suffix>
  Then the product results should be exactly "Tomato - 1 Kg"
  Examples:
    | method  | suffix               |
    | insert  | without key events   |
    | paste   |                      |
```

---

### 1.2 🟠 Strings that trigger JavaScript type coercion, invisible characters, Unicode normalisation

**Gap:** `product_search_coverage.feature` already covers regex metacharacters and `<script>`. It doesn't cover:

| Input | Why it can break |
|---|---|
| `null`, `undefined`, `[object Object]` | Typical result of a bug like `name + filter` or `String(obj)`. A careless implementation **matches everything**. |
| `NaN` | Looks like nonsense, but should match **Banana** (`baNANa`, case-insensitive). A good check that the code really does substring matching. |
| `Tom` + U+200B + `ato` | Zero-width space, often pasted from Slack/Word. Shouldn't match, and there should be no crash. |
| `Brócolli` composed (U+00F3) vs decomposed (`o` + U+0301) | They look identical but compare unequal. A matcher that doesn't normalise treats them differently. |
| U+202E (RTL override) + `otamoT` | Bidi characters can visually spoof a term. |
| `x` × 100 000 | Checks the UI stays responsive (synchronous filtering on every keystroke). |

```gherkin
@search @edge
Scenario Outline: JavaScript-coercion strings are matched literally
  When I type "<term>" into the product search
  Then the product results should be exactly "<expected>"
  Examples:
    | term            | expected      |
    | NaN             | Banana - 1 Kg |

@search @edge
Scenario Outline: Coercion artefacts match nothing
  When I type "<term>" into the product search
  Then no product cards should be shown
  Examples:
    | term            |
    | null            |
    | undefined       |
    | [object Object] |
```
```ts
When('I type {string} with a zero-width space at index {int}', async function (this: CustomWorld, term: string, i: number) {
    await this.page.locator('.search-keyword').fill(term.slice(0, i) + '​' + term.slice(i));
});

When('I type {string} in decomposed Unicode form', async function (this: CustomWorld, term: string) {
    await this.page.locator('.search-keyword').fill(term.normalize('NFD'));
});

Then('filtering a {int}-character term completes within {int} ms', async function (this: CustomWorld, len: number, budget: number) {
    const started = Date.now();
    await this.page.locator('.search-keyword').fill('x'.repeat(len));
    await expect(this.page.locator('.products .product')).toHaveCount(0);
    expect(Date.now() - started).toBeLessThan(budget);
});
```

---

### 1.3 🔴 Quantity boundaries are impossible to express in the current steps

**Gap (framework-level):** `I attempt to add {string} with a quantity of {int}` uses `{int}`, so Cucumber **can't pass** `1.5`, `abc`, `""`, `1e3` or `-0`. The step never sees the inputs most likely to break the app. Also, the **+ / − buttons** on each GreenKart card aren't tested at all, and "decrement below 1" is the classic off-by-one.

```ts
// Take the raw string so any value reaches the browser
When('I set the quantity of {string} to the raw value {string}', async function (this: CustomWorld, name: string, raw: string) {
    const qty = this.page.locator('.product').filter({ hasText: name }).locator('input.quantity');
    await qty.clear();
    await qty.pressSequentially(raw);          // fill() throws on non-numeric text in <input type=number>
});

When('I click {word} on {string} {int} times', async function (this: CustomWorld, button: 'increment' | 'decrement', name: string, times: number) {
    const btn = this.page.locator('.product').filter({ hasText: name }).locator(`a.${button}`);   // ⚠ verify
    for (let i = 0; i < times; i++) await btn.click();
});

Then('the quantity of {string} should be {string}', async function (this: CustomWorld, name: string, value: string) {
    await expect(this.page.locator('.product').filter({ hasText: name }).locator('input.quantity')).toHaveValue(value);
});
```
```gherkin
@cart @edge
Scenario: Decrement never goes below 1
  When I click decrement on "Cucumber" 3 times
  Then the quantity of "Cucumber" should be "1"

@cart @edge
Scenario Outline: Unusual quantity values are not added as-is
  When I set the quantity of "Cucumber" to the raw value "<raw>"
  And I add "Cucumber" to my cart
  Then the cart should not contain a line with quantity "<raw>"
  Examples:
    | raw              | note                              |
    | 1.5              | fractional                        |
    | 1e3              | valid number syntax, 1000 units   |
    | -0               | negative zero                     |
    | 9007199254740993 | beyond Number.MAX_SAFE_INTEGER    |
```

---

### 1.4 🟠 Promo code edge cases (GreenKart cart page)

Nothing in the suite covers the promo field. ⚠ verify the selectors (`.promoCode`, `.promoBtn`, `.promoInfo`) and the message text.

```gherkin
@checkout @promo @edge
Scenario Outline: Promo code boundary inputs
  Given I have "Cucumber" in my cart
  And I proceed to checkout
  When I apply the promo code "<code>"
  Then the promo message should be "<message>"
  Examples:
    | code                      | message          | risk                          |
    | <empty>                   | Empty code ..!   | empty                         |
    | <sp><sp><sp>              | Empty code ..!   | whitespace-only — decide: trim? |
    | <sp>rahulshettyacademy<sp> | Code applied ..! | padded valid code             |
    | RAHULSHETTYACADEMY        | Invalid code ..! | case sensitivity — decide     |
    | rahulshettyacademy' --    | Invalid code ..! | injection probe               |
```

> **Gherkin gotcha:** table cells are trimmed, so `|   |` and `| code |` with padding both lose their whitespace. You can't express a whitespace boundary in a table directly. Use placeholder tokens and decode them in the step:

```ts
const decode = (raw: string) => raw.replace(/<empty>/g, '').replace(/<sp>/g, ' ').replace(/<tab>/g, '\t');

When('I apply the promo code {string}', async function (this: CustomWorld, raw: string) {
    await this.page.locator('.promoCode').fill(decode(raw));
    await this.page.locator('.promoBtn').click();
});
Then('the promo message should be {string}', async function (this: CustomWorld, msg: string) {
    await expect(this.page.locator('.promoInfo')).toHaveText(msg, { timeout: 10_000 });   // validation is async
});
```

```gherkin
@checkout @promo @edge
Scenario: Applying a valid code twice does not stack the discount
  Given I have "Cucumber" in my cart
  And I proceed to checkout
  When I apply the promo code "rahulshettyacademy"
  And I apply the promo code "rahulshettyacademy"
  Then the discount percentage should be applied exactly once

@checkout @promo @edge
Scenario: An invalid code after a valid one does not leave a stale discount
  Given I have "Cucumber" in my cart
  And I proceed to checkout
  When I apply the promo code "rahulshettyacademy"
  And I apply the promo code "WRONG"
  Then the discounted total should equal the original total
```

---

### 1.5 🔴 File upload: hostile file names and sizes (the-internet)

**Gap:** `test_file_upload` only uploads one plain `.txt` file. Three high-value cases are missing:
- **Path traversal in the name.** Playwright's `FilePayload` lets you send any file name, which you can't do with a real file on disk.
- **NFD file names.** macOS (your OS) stores `é` in decomposed form. Servers and displays may show it composed, so a text comparison fails even though the names look identical.
- **Oversized upload.** The server should reject it cleanly, not return a 5xx.

```python
# tests/ui/test_upload_edges.py
import unicodedata
import pytest
from playwright.sync_api import Page, expect

UPLOAD = "https://the-internet.herokuapp.com/upload"

def submit(page: Page, files):
    page.goto(UPLOAD)
    page.locator("#file-upload").set_input_files(files)
    with page.expect_response(lambda r: r.url.endswith("/upload") and r.request.method == "POST") as resp:
        page.locator("#file-submit").click()
    return resp.value

def test_path_traversal_filename_is_not_echoed_as_a_path(page: Page):
    response = submit(page, {"name": "../../etc/passwd", "mimeType": "text/plain", "buffer": b"x"})
    assert response.status < 500
    expect(page.locator("#uploaded-files")).not_to_contain_text("../")

def test_nfd_filename_round_trips(page: Page):
    nfd_name = unicodedata.normalize("NFD", "café-résumé.txt")
    submit(page, {"name": nfd_name, "mimeType": "text/plain", "buffer": b"x"})
    shown = page.locator("#uploaded-files").text_content() or ""
    assert unicodedata.normalize("NFC", shown.strip()) == unicodedata.normalize("NFC", nfd_name)

@pytest.mark.parametrize("size_mb", [0, 25])
def test_extreme_sizes_fail_gracefully(page: Page, size_mb):
    response = submit(page, {"name": f"{size_mb}mb.bin", "mimeType": "application/octet-stream",
                             "buffer": b"\0" * (size_mb * 1024 * 1024)})
    assert response.status < 500, f"server error on {size_mb} MB upload"
```

---

### 1.6 🟠 Login: inputs that look valid but aren't

Builds on the boundary table in the first report. These are the ones that table **doesn't** cover:

```python
@pytest.mark.parametrize("username, password, why", [
    ("tоmsmith", "SuperSecretPassword!", "Cyrillic 'о' homoglyph — must not authenticate"),
    ("tomsmith\u0000", "SuperSecretPassword!", "null byte truncation"),
    ("tomsmith", "SuperSecretPassword!​", "zero-width char pasted from a password manager"),
    ("tomsmith", "🔑" * 64, "4-byte UTF-8 chars in password"),
])
def test_lookalike_credentials_are_rejected(page: Page, username, password, why):
    page.goto("https://the-internet.herokuapp.com/login")
    page.get_by_label("Username").fill(username)
    page.get_by_label("Password").fill(password)
    page.get_by_role("button", name="Login").click()
    expect(page, why).not_to_have_url(re.compile(r"/secure"))
```

---

### 1.7 🟢 Sauce Demo cart quantity field

On the Shopify cart page, setting quantity to `0` should remove the line. Negative, decimal, and values above stock aren't tested. Shopify validates on the server, so check the **server's** response, not just the UI:

```python
@pytest.mark.parametrize("qty, expect_present", [("0", False), ("-1", True), ("1.5", True), ("99999", True)])
def test_cart_quantity_update_boundaries(page: Page, qty, expect_present):
    add_grey_jacket(page)
    page.goto(BASE_URL + "cart")
    page.locator("input[name^='updates']").fill(qty)              # ⚠ verify selector
    page.get_by_role("button", name=re.compile("update", re.I)).click()
    row = page.get_by_text("Grey jacket")
    expect(row).to_have_count(1 if expect_present else 0)
    if expect_present:
        expect(page.locator("input[name^='updates']")).not_to_have_value(re.compile(r"^-|\."))  # never stored as-is
```

---

## 2. Async, Race & Timing Flakiness

### 2.1 🔴 Playwright APIs that look like they wait but don't

This is the Playwright version of Selenium's implicit-vs-explicit wait trap. Actions (`click`, `fill`) and `expect(...)` **auto-wait**. These calls return **immediately** with whatever the DOM looks like at that moment:

| API (Py / TS) | What it waits for | Where this repo relies on it |
|---|---|---|
| `count()` | nothing | `search_steps.ts:19, 36`, `checkout_steps.ts:35` |
| `is_visible()` / `isVisible()` | nothing (no timeout) | — (watch for it) |
| `all_text_contents()` / `allTextContents()` | nothing | — |
| `text_content()` / `textContent()` | element **attached** only. Not visible, not final text. | `test_isolation.py:22`, `search_steps.ts:23`, `checkout_steps.ts:39,43` |

**The hidden-but-present trap.** `text_content()` happily reads text from an element that is still `display:none`:

```python
def test_text_content_reads_hidden_text_before_it_is_shown(page: Page):
    page.goto("https://the-internet.herokuapp.com/dynamic_loading/1")
    finish = page.locator("#finish")
    # Passes BEFORE clicking Start: the text is in the DOM but hidden.
    assert "Hello World!" in (finish.text_content() or "")
    expect(finish).to_be_hidden()                     # the truth the user sees
    page.get_by_role("button", name="Start").click()
    expect(finish).to_be_visible(timeout=10_000)      # explicit, retrying — the correct check
```

Use this as a regression demo for the team. The same trap applies to `get_cart_count()` whenever the badge exists but hasn't updated yet.

---

### 2.2 🔴 Cucumber's step timeout fires before Playwright's

`hooks.ts` sets Cucumber's step timeout to **30s**. In library mode (Cucumber driving Playwright directly), Playwright's default action timeout is **also 30s**. When a click hangs, Cucumber kills the step first, and you get `function timed out, ensure the promise resolves within 30000 milliseconds`. That message **drops Playwright's call log** (which locator, what it was waiting for, actionability state).

```ts
// support/hooks.ts — inner timeouts must be strictly shorter than the outer one
setDefaultTimeout(60_000);                                   // Cucumber: outer safety net

Before(async function (this: CustomWorld) {
    this.context = await browser.newContext();
    this.context.setDefaultTimeout(15_000);                  // actions: fail first, with a useful log
    this.context.setDefaultNavigationTimeout(30_000);
    this.page = await this.context.newPage();
});
```

---

### 2.3 🔴 Order confirmation only shows briefly before an auto-redirect

**Gap:** the checkout feature stops at the cart page. The rest of the flow (`Place Order` → country → `Proceed`) shows a "Thank you…" message, then **redirects home after a few seconds** and resets the cart. A slow assertion misses the message completely, and the cart reset isn't checked. ⚠ verify selectors and message text.

```ts
When('I place the order for country {string} accepting the terms', async function (this: CustomWorld, country: string) {
    await this.page.getByRole('button', { name: 'Place Order' }).click();
    await this.page.locator('select').selectOption(country);
    await this.page.locator('.chkAgree').check();
    await this.page.getByRole('button', { name: 'Proceed' }).click();
});

Then('the order confirmation is shown and then I am returned home with an empty cart', async function (this: CustomWorld) {
    await expect(this.page.getByText(/your order has been placed successfully/i)).toBeVisible({ timeout: 3_000 });
    await this.page.waitForURL(/seleniumPractise\/#\/$/, { timeout: 15_000 });
    await expect(this.page.locator('.cart-info table tr').nth(0).locator('strong')).toHaveText('0');
});
```

---

### 2.4 🔴 Navigating away while a request is still running

**Gap:** nothing tests leaving a page while async work is pending. The usual result is a React "state update on unmounted component" error, or an uncaught exception that shows up in nobody's report.

Checking that something **doesn't** happen needs a fixed observation window. That is the **one** legitimate use of a fixed wait, so name it as such:

```ts
// support/hooks.ts — collect uncaught errors per scenario
Before(async function (this: CustomWorld) {
    this.pageErrors = [];
    this.page.on('pageerror', err => this.pageErrors.push(err.message));
});
```
```ts
When('I apply the promo code {string} and immediately navigate back', async function (this: CustomWorld, code: string) {
    await this.page.locator('.promoCode').fill(code);
    await this.page.locator('.promoBtn').click();
    await this.page.goBack();
});

Then('no uncaught page errors occur within {int} seconds', async function (this: CustomWorld, secs: number) {
    await this.page.waitForTimeout(secs * 1000);   // deliberate observation window, not a sync wait
    expect(this.pageErrors).toEqual([]);
});
```

---

### 2.5 🟠 Responses arriving out of order (any server-backed search or autocomplete)

**Gap:** if a slower response for an *older* query lands after the newer one, the UI shows stale results. Only server-backed search can hit this. GreenKart filters on the client. Sauce Demo's theme search might hit the server (⚠ verify the endpoint). The technique is to **hold the first route and release it last**. In the sync Python API, don't sleep inside a route handler. Store the route and finish it later from the test body:

```python
def test_older_search_response_does_not_overwrite_newer(page: Page):
    held = []
    def hold_first(route):
        if not held:
            held.append(route)          # stall the older query
        else:
            route.continue_()
    page.route(re.compile(r"/search"), hold_first)   # ⚠ verify predictive-search endpoint

    page.goto(BASE_URL)
    box = page.get_by_role("searchbox").first
    box.press_sequentially("sh")         # query 1 — held
    box.fill("jacket")                   # query 2 — flows
    results = page.locator("[id*=predictive], .search-results")    # ⚠ verify
    expect(results).to_contain_text("jacket", ignore_case=True)

    held[0].continue_()                  # stale response arrives last
    page.wait_for_load_state("networkidle")
    expect(results).to_contain_text("jacket", ignore_case=True)    # still the newer results
```

---

### 2.6 🟠 Button text changes during the add-to-cart animation

After a click, GreenKart's button changes from **ADD TO CART** to **✔ ADDED**, then back again. Two consequences the steps don't handle:
- Clicking the same product twice quickly: the second lookup by `hasText: 'ADD TO CART'` **waits until the text changes back**. Nobody tests a fast double-add.
- A wrong-but-plausible locator (e.g. `button` with no text filter) clicks during the "ADDED" state.

```gherkin
@cart @edge
Scenario: Two quick adds of the same product count as quantity 2
  When I add "Cucumber" to my cart
  And I add "Cucumber" to my cart
  Then the cart preview line for "Cucumber" should show quantity 2
```
```ts
Then('the button for {string} should briefly confirm the add', async function (this: CustomWorld, name: string) {
    const btn = this.page.locator('.product').filter({ hasText: name }).getByRole('button');
    await btn.click();
    await expect(btn).toHaveText(/ADDED/);          // transient state
    await expect(btn).toHaveText('ADD TO CART');    // and it recovers
});
```

---

### 2.7 🟠 Races that only show up on slow machines: CPU throttling

Network throttling (first report, H5) misses races that come from slow JavaScript. CI runners are often 4–6× slower than a laptop. Reproduce that locally:

```python
@pytest.fixture
def slow_cpu_page(page: Page):
    cdp = page.context.new_cdp_session(page)          # Chromium only
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 6})
    yield page
    cdp.send("Emulation.setCPUThrottlingRate", {"rate": 1})

def test_add_to_cart_on_slow_cpu(slow_cpu_page: Page):
    add_grey_jacket(slow_cpu_page)
```

---

### 2.8 🟢 iframe reloads mid-interaction

`frame_locator()` re-resolves on every call, but an `ElementHandle` from `frame.query_selector()` doesn't. A frame that reloads (ads, auth refresh) in the middle of a test breaks the handle-based style:

```python
def test_frame_locator_survives_iframe_reload(page: Page):
    page.goto("https://the-internet.herokuapp.com/iframe")
    body = page.frame_locator("iframe").locator("#tinymce")
    expect(body).to_be_visible()
    page.locator("iframe").evaluate("f => f.src = f.src")      # reload frame mid-test
    expect(body).to_be_visible()                                # locator re-resolves
```

---

## 3. State & DOM Disruptions

### 3.1 🔴 Deep links and refreshes into a step that needs earlier state

GreenKart keeps its cart in SPA memory. If a user bookmarks `#/cart`, or refreshes on `#/country`, they arrive at a later step **with empty state**. The risk is placing an **empty order** or a crash. Nothing tests this. ⚠ verify the expected UI (disabled button vs message).

```gherkin
@checkout @state @edge
Scenario: Deep link to the cart page with an empty cart
  When I open the GreenKart page "#/cart" directly
  Then I should not be able to place an order

@checkout @state @edge
Scenario: Refreshing the country step does not place an empty order
  Given I have "Cucumber" in my cart
  And I proceed to checkout
  And I click "Place Order"
  When I refresh the page
  And I select "India", accept the terms and click "Proceed"
  Then no order confirmation should be shown

@checkout @state @edge
Scenario: Proceeding without accepting terms is blocked
  Given I have "Cucumber" in my cart
  And I proceed to checkout
  And I click "Place Order"
  When I select "India" and click "Proceed"
  Then the terms error should be shown
```
```ts
Then('I should not be able to place an order', async function (this: CustomWorld) {
    const place = this.page.getByRole('button', { name: 'Place Order' });
    if (await place.count() === 0) return;                 // not rendered at all — acceptable
    await expect(place).toBeDisabled();
    await place.click({ force: true });                    // even a forced click must not progress
    await expect(this.page).not.toHaveURL(/#\/country/);
});
```

---

### 3.2 🔴 Two tabs sharing one session (Sauce Demo)

**Gap:** Shopify's cart lives in a **cookie shared by every tab** of a browser context. If a user removes an item in tab A, then checks out from a stale tab B, the checkout must use the server's state, not what tab B is showing.

```python
def test_checkout_from_stale_tab_reflects_removal_in_other_tab(context):
    tab_a = context.new_page()
    add_grey_jacket(tab_a)

    tab_b = context.new_page()
    tab_b.goto(BASE_URL + "cart")
    expect(tab_b.get_by_text("Grey jacket")).to_be_visible()     # B now holds a stale view

    tab_a.goto(BASE_URL + "cart")
    tab_a.locator("input[name^='updates']").fill("0")            # ⚠ verify — remove via qty 0
    tab_a.get_by_role("button", name=re.compile("update", re.I)).click()

    tab_b.locator("input[name='checkout']").click()             # act from the stale tab
    expect(tab_b.get_by_text("Grey jacket")).to_have_count(0)    # server state wins
```

**GreenKart's version (a new tab gets separate in-memory state):**

```ts
When('I open Top Deals in a new tab', async function (this: CustomWorld) {
    const [deals] = await Promise.all([
        this.context.waitForEvent('page'),
        this.page.getByRole('link', { name: 'Top Deals' }).click(),
    ]);
    await deals.waitForLoadState('domcontentloaded');
    this.secondaryPage = deals;
});

Then('the original tab still shows {int} item(s) in the cart', async function (this: CustomWorld, n: number) {
    await this.page.bringToFront();
    await expect(this.page.locator('.cart-info table tr').nth(0).locator('strong')).toHaveText(String(n));
});

When('I close the original tab and continue in the new tab', async function (this: CustomWorld) {
    await this.page.close();
    this.page = this.secondaryPage!;                       // hooks' After must close whatever page is current
});
```

---

### 3.3 🔴 Session lost mid-flow

**Gap:** expired sessions, cleared cookies and logging out in another tab are all untested. Users hit them all the time, and they are where null-state crashes happen.

```python
def test_secure_page_after_cookies_cleared_redirects_to_login(page: Page, context):
    page.goto("https://the-internet.herokuapp.com/login")
    page.get_by_label("Username").fill("tomsmith")
    page.get_by_label("Password").fill("SuperSecretPassword!")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url(re.compile(r"/secure"))

    context.clear_cookies()                                   # session expires
    page.reload()
    expect(page).to_have_url(re.compile(r"/login"))
    expect(page.locator("#flash")).to_contain_text("You must login")

def test_logout_in_one_tab_invalidates_the_other(context):
    tab_a, tab_b = context.new_page(), context.new_page()
    tab_a.goto("https://the-internet.herokuapp.com/login")
    tab_a.get_by_label("Username").fill("tomsmith")
    tab_a.get_by_label("Password").fill("SuperSecretPassword!")
    tab_a.get_by_role("button", name="Login").click()
    tab_b.goto("https://the-internet.herokuapp.com/secure")
    expect(tab_b.get_by_role("heading", name="Secure Area")).to_be_visible()
    tab_a.get_by_role("link", name="Logout").click()
    tab_b.reload()
    expect(tab_b).to_have_url(re.compile(r"/login"))

def test_cart_cleared_cookies_before_checkout(page: Page, context):
    add_grey_jacket(page)
    context.clear_cookies()
    page.goto(BASE_URL + "cart")
    expect(page.get_by_text("Grey jacket")).to_have_count(0)
    expect(page.locator("input[name='checkout']")).to_have_count(0)   # ⚠ verify empty-cart UI
```

---

### 3.4 🔴 Native dialogs are dismissed silently

**Gap:** with no `dialog` listener, Playwright **auto-dismisses** every `alert`/`confirm`/`prompt`/`beforeunload`. An error alert, or a "leave this page?" prompt, disappears without a trace and the test passes. Neither suite listens for dialogs.

```python
# tests/ui/conftest.py — add to the browser-errors fixture from the first report
def on_dialog(dialog):
    errors.append(f"[dialog:{dialog.type}] {dialog.message}")
    dialog.dismiss()
page.on("dialog", on_dialog)
```
```ts
// support/hooks.ts
this.page.on('dialog', async d => { this.pageErrors.push(`[dialog:${d.type()}] ${d.message()}`); await d.dismiss(); });
```

Practice target: `https://the-internet.herokuapp.com/javascript_alerts`. Check that the result text reads **"You clicked: Cancel"** when the suite's default is to dismiss. That proves the dismiss path, not just the accept path.

---

### 3.5 🟠 Overlays covering the element you're clicking

**Gap:** cookie banners, newsletter pop-ups (common on Shopify themes) and chat widgets show up **at random times**. A click then lands on the overlay, or fails because something is on top. Playwright has a built-in fix that neither suite uses: `add_locator_handler`.

```python
# tests/ui/conftest.py
@pytest.fixture(autouse=True)
def dismiss_interruptions(page: Page):
    page.add_locator_handler(
        page.get_by_role("dialog").filter(has_text=re.compile("newsletter|subscribe|cookies", re.I)),  # ⚠ verify
        lambda overlay: overlay.get_by_role("button", name=re.compile("close|accept|no thanks", re.I)).click(),
    )
    yield
```
```ts
await this.page.addLocatorHandler(
    this.page.getByRole('dialog').filter({ hasText: /newsletter|cookies/i }),
    async overlay => { await overlay.getByRole('button', { name: /close|accept/i }).click(); },
);
```

**Test the disruption on purpose.** Inject an overlay and assert the click still lands on the real target:

```python
def test_add_to_cart_with_injected_overlay(page: Page):
    page.goto(BASE_URL)
    page.evaluate("""() => {
        const d = document.createElement('div');
        d.setAttribute('role', 'dialog'); d.textContent = 'Subscribe to our newsletter';
        d.style.cssText = 'position:fixed;inset:0;background:#0008;z-index:99999';
        const b = document.createElement('button'); b.textContent = 'Close';
        b.onclick = () => d.remove(); d.appendChild(b); document.body.appendChild(d);
    }""")
    add_grey_jacket(page)
```

---

### 3.6 🟠 Disabled controls and controls that get replaced

**Gaps:**
- No test checks that a **disabled** control actually refuses input, or that a **client-side disable** can't be bypassed.
- No test covers a node that gets **removed and re-added**. Selenium users know this as `StaleElementReferenceException`. Playwright *locators* recover, but *element handles* don't, and practice code often mixes the two.

```python
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

DYN = "https://the-internet.herokuapp.com/dynamic_controls"

def test_disabled_input_rejects_typing_then_accepts_unicode(page: Page):
    page.goto(DYN)
    field = page.locator("#input-example input")
    expect(field).to_be_disabled()
    with pytest.raises(PlaywrightTimeoutError):
        field.fill("x", timeout=1_000)                   # must not type into a disabled field
    page.get_by_role("button", name="Enable").click()
    expect(field).to_be_enabled()                        # waits through the loading bar
    field.fill("🙂 ünïcödé  ")
    expect(field).to_have_value("🙂 ünïcödé  ")

def test_handle_goes_stale_but_locator_recovers(page: Page):
    page.goto(DYN)
    checkbox = page.locator("#checkbox-example input[type='checkbox']")
    handle = checkbox.element_handle()
    page.get_by_role("button", name="Remove").click()
    expect(page.locator("#message")).to_have_text("It's gone!")
    page.get_by_role("button", name="Add").click()
    expect(page.locator("#message")).to_have_text("It's back!")
    assert handle.evaluate("el => el.isConnected") is False      # old handle points at a detached node
    checkbox.check()                                              # locator re-resolves to the new node
    expect(checkbox).to_be_checked()
```

---

### 3.7 🟠 Hidden duplicate elements, and `.first()` used to silence strict mode

`add_to_cart_steps.ts:56` uses `.first()` "to fix a strict-mode violation". Strict mode was warning you that **two** elements match, probably one visible and one hidden (cart preview vs header, or desktop vs mobile layout). `.first()` picks by DOM order, not by visibility, so the assertion can end up targeting the hidden one.

The same thing happens in Python: `a.cart.desktop` is probably hidden at mobile widths (⚠ verify), but `get_cart_count()` reads it anyway, because `text_content()` ignores visibility.

```ts
const emptyMsg = this.page.locator('.empty-cart h2').filter({ visible: true });   // Playwright ≥ 1.51
await expect(emptyMsg).toHaveCount(1);
await expect(emptyMsg).toHaveText('You cart is empty!');
```
```python
def test_cart_indicator_on_mobile_viewport(page: Page):
    page.set_viewport_size({"width": 375, "height": 812})
    page.goto(BASE_URL)
    expect(page.locator("a.cart.desktop")).to_be_hidden()          # proves the helper reads a hidden node
    # Fix the helper: read from whichever cart link is visible at this viewport
    visible_cart = page.locator("a.cart, a[href='/cart']").filter(visible=True).first   # ⚠ verify mobile selector
    expect(visible_cart).to_be_visible()
```

---

### 3.8 🟠 Day 4 widgets: interactions that hide bugs

| Widget | Hidden risk | Test |
|---|---|---|
| Checkboxes | `check()` / `uncheck()` are **idempotent**. They set the final state, so they never reveal a broken toggle. | Use `click()` and assert it flipped. |
| Checkboxes | **Firefox restores form state on reload**; Chromium doesn't. | Run the reload test with `--browser firefox`. |
| Drag & drop | Dropping on itself, or outside any column, is untested. | See below. |
| Shadow DOM | Playwright pierces **open** shadow roots only. If the component switches to `mode: 'closed'`, the locator finds nothing. | Assert the root mode so the change is noticed. |

```python
def test_checkbox_click_toggles(page: Page):
    page.goto("https://the-internet.herokuapp.com/checkboxes")
    cb = page.locator("input[type='checkbox']").nth(1)        # starts checked
    cb.click(); expect(cb).not_to_be_checked()
    cb.click(); expect(cb).to_be_checked()

def test_checkbox_state_after_reload(page: Page, browser_name):
    page.goto("https://the-internet.herokuapp.com/checkboxes")
    cb = page.locator("input[type='checkbox']").nth(0)
    cb.check()
    page.reload()
    if browser_name == "firefox":
        expect(cb).to_be_checked()        # form-state restoration
    else:
        expect(cb).not_to_be_checked()

def test_drop_on_self_and_outside_changes_nothing(page: Page):
    page.goto("https://the-internet.herokuapp.com/drag_and_drop")
    a, b = page.locator("#column-a"), page.locator("#column-b")
    a.drag_to(a)
    a.drag_to(page.locator("h3"))
    expect(a).to_have_text("A")
    expect(b).to_have_text("B")

def test_shadow_root_is_open(page: Page):
    page.goto("https://the-internet.herokuapp.com/shadowdom")
    mode = page.locator("my-paragraph").first.evaluate("el => el.shadowRoot ? el.shadowRoot.mode : 'closed-or-none'")
    assert mode == "open", "locators cannot pierce a closed shadow root"
```

---

### 3.9 🟢 Focus loss while typing

Clicking somewhere else halfway through typing a search, then typing more, is untested. Some implementations reset or re-filter on blur.

```gherkin
@search @edge
Scenario: Search keeps its value after losing focus
  When I type "Tom" into the product search
  And I click outside the search box
  And I continue typing "ato" into the product search
  Then the product results should be exactly "Tomato - 1 Kg"
```
```ts
When('I click outside the search box', async function (this: CustomWorld) {
    await this.page.locator('body').click({ position: { x: 5, y: 5 } });
});
When('I continue typing {string} into the product search', async function (this: CustomWorld, more: string) {
    await this.page.locator('.search-keyword').press('End');
    await this.page.locator('.search-keyword').pressSequentially(more);
});
```

---

## Priority Order

1. **Blind spots in the infrastructure** (they hide everything else): 2.1 non-waiting APIs, 2.2 timeout order, 3.4 dialogs, 3.7 `.first()`/hidden duplicates.
2. **Money and state:** 2.3 order confirmation + redirect, 3.1 empty-state deep links, 3.2 two tabs, 3.3 session loss.
3. **Hostile input:** 1.1 paste/IME, 1.3 quantity, 1.5 upload names.
4. **Everything else**, in severity order.
