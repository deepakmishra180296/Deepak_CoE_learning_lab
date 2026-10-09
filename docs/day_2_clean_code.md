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

## 7. Example: Refactoring Unclean Code into Clean Code (Python)

The example below calculates the total price of an order. The **behavior is exactly the same** before and after the refactoring; only the structure, naming, and readability change.

**Business rules:**
- Customers get a tier discount: Silver 10% off, Gold 20% off, Regular none.
- Items with zero quantity are ignored.
- Orders above 500 after the tier discount get a flat 50 off.
- 18% GST is added to the final amount.

### 7.1 Before: Unclean Code

```python
def proc(d, t, f, lst):
    # process order
    r = 0
    if d != None:
        if len(d["items"]) > 0:
            for i in d["items"]:
                if i["q"] > 0:
                    if t == 1:
                        r = r + i["p"] * i["q"] * 0.9
                    elif t == 2:
                        r = r + i["p"] * i["q"] * 0.8
                    else:
                        r = r + i["p"] * i["q"]
            if r > 500:
                r = r - 50
            r = r + r * 0.18
            if f:
                print("Order total: " + str(r))
            lst.append(r)
            return r
        else:
            return -1
    else:
        return -1
```

### 7.2 After: Clean Code

```python
from dataclasses import dataclass
from enum import Enum

GST_RATE = 0.18
BULK_ORDER_THRESHOLD = 500
BULK_ORDER_DISCOUNT = 50


class CustomerTier(Enum):
    REGULAR = "regular"
    SILVER = "silver"
    GOLD = "gold"


TIER_PRICE_MULTIPLIER = {
    CustomerTier.REGULAR: 1.0,
    CustomerTier.SILVER: 0.9,  # 10% off
    CustomerTier.GOLD: 0.8,    # 20% off
}


class EmptyOrderError(ValueError):
    """Raised when an order has no billable items."""


@dataclass
class OrderItem:
    unit_price: float
    quantity: int

    @property
    def subtotal(self) -> float:
        return self.unit_price * self.quantity


@dataclass
class Order:
    items: list[OrderItem]
    customer_tier: CustomerTier


def calculate_order_total(order: Order) -> float:
    billable_items = get_billable_items(order.items)
    subtotal = sum(item.subtotal for item in billable_items)
    discounted_amount = apply_tier_discount(subtotal, order.customer_tier)
    discounted_amount = apply_bulk_order_discount(discounted_amount)
    return add_gst(discounted_amount)


def get_billable_items(items: list[OrderItem]) -> list[OrderItem]:
    if not items:
        raise EmptyOrderError("Order must contain at least one item.")
    return [item for item in items if item.quantity > 0]


def apply_tier_discount(amount: float, tier: CustomerTier) -> float:
    return amount * TIER_PRICE_MULTIPLIER[tier]


def apply_bulk_order_discount(amount: float) -> float:
    if amount > BULK_ORDER_THRESHOLD:
        return amount - BULK_ORDER_DISCOUNT
    return amount


def add_gst(amount: float) -> float:
    return amount * (1 + GST_RATE)
```

Printing and storing the result are no longer hidden inside the calculation. The caller decides what to do with the total:

```python
order = Order(
    items=[OrderItem(unit_price=400, quantity=2), OrderItem(unit_price=15, quantity=3)],
    customer_tier=CustomerTier.GOLD,
)

order_total = calculate_order_total(order)   # query: only calculates
order_history.append(order_total)            # command: done explicitly by the caller
print(f"Order total: {order_total:.2f}")
```

### 7.3 Tests: Clean Code Includes Tests

```python
import pytest


def test_gold_customer_gets_tier_and_bulk_discount():
    order = Order([OrderItem(unit_price=400, quantity=2)], CustomerTier.GOLD)
    # 800 * 0.8 = 640 -> bulk discount -> 590 -> +18% GST -> 696.20
    assert calculate_order_total(order) == pytest.approx(696.20)


def test_regular_customer_below_bulk_threshold_pays_full_price_plus_gst():
    order = Order([OrderItem(unit_price=100, quantity=2)], CustomerTier.REGULAR)
    assert calculate_order_total(order) == pytest.approx(236.00)


def test_empty_order_raises_error():
    with pytest.raises(EmptyOrderError):
        calculate_order_total(Order(items=[], customer_tier=CustomerTier.SILVER))
```

### 7.4 What Changed and Why

| Refactoring step | Before | After | Benefit |
|---|---|---|---|
| **Intention-revealing names** | `proc(d, t, f, lst)`, `r`, `i["p"]` | `calculate_order_total(order)`, `unit_price`, `quantity` | Code explains itself; no comment needed |
| **Named constants** | `0.18`, `500`, `50` | `GST_RATE`, `BULK_ORDER_THRESHOLD`, `BULK_ORDER_DISCOUNT` | Searchable; one place to change a rule |
| **Enum instead of number codes** | `t == 1`, `t == 2` | `CustomerTier.SILVER`, `CustomerTier.GOLD` | Invalid tiers are impossible; meaning is obvious |
| **Nouns for classes** | Raw dictionaries | `Order`, `OrderItem` | Data has a clear structure and name |
| **Verbs for functions** | `proc` | `apply_tier_discount`, `add_gst` | Each name states the action |
| **Small, single-purpose functions** | One 20-line function | Five functions of 1 to 5 lines | Easy to read, test, and change in isolation |
| **Flat structure** | Four levels of nesting | No nesting beyond one `if` | Logic reads top to bottom like a story |
| **Fewer arguments** | 4 arguments, including a flag | 1 argument | Easier to call and understand |
| **Command-Query Separation** | Calculates, prints, and appends | Only calculates; caller prints and stores | No hidden side effects |
| **Exceptions over error codes** | `return -1` | `raise EmptyOrderError(...)` | Errors can't be silently mistaken for a price |
| **DRY** | `p * q` repeated three times | `OrderItem.subtotal` defined once | A single source of truth |
| **Tests** | None | Unit tests for key rules | Safe to refactor further |

### 7.5 Key Takeaway

The clean version is longer in lines, but far easier to **read** (`calculate_order_total` reads like the business rules), **understand** (every name and constant explains itself), and **work on** (changing the GST rate touches one line, adding a new tier touches only the enum and its multiplier, and tests confirm nothing broke).

---

## 8. Example: Error Handling - Playwright Test

The example verifies that a web page contains a welcome message with proper exception handling. It only handles expected failure and preserves the test failure status.


```python
import pytest
from playwright.sync_api import Page, expect

Def test_welcome_message_is_visible(page: Page) -> None:
	"""
	Verify that the welcome message is present and visible.
	"""
	
	page.goto("https://example.com")
	
	welcome_message = page.get_by_test_id("welcome-message")

	try:
		except(welcome_message).to_be_visible(timeout=5000)

	except AssertionError as error:
		purest.fail(
			f"welcome message is missing or not visible."
			f"Details: {error}",
			pytrace=False
				)
```
**Notes:**
- The exception handler specifically catches AssertionError.
- We avoid catching unrelated exceptions unnecessarily.

