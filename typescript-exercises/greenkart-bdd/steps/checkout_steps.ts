import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { CustomWorld } from '../support/hooks';

const HOME_URL = 'https://rahulshettyacademy.com/seleniumPractise/#/';

const locators = {
    addToCartButton: (page: Page, productName: string) =>
        page.locator('.product').filter({ hasText: productName }).getByRole('button', { name: 'ADD TO CART' }),
    cartIcon: (page: Page) => page.locator('a.cart-icon'),
    proceedToCheckoutButton: (page: Page) => page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }),
    orderRows: (page: Page) => page.locator('table.cartTable tbody tr'),
    orderRow: (page: Page, productName: string) => locators.orderRows(page).filter({ hasText: productName }),
    rowTotal: (row: ReturnType<Page['locator']>) => row.locator('td p.amount').last(),
    displayedTotal: (page: Page) => page.locator('.totAmt'),
};

Given('I have {string} in my cart', async function (this: CustomWorld, productName: string) {
    await this.page.goto(HOME_URL);
    await locators.addToCartButton(this.page, productName).click();
});


Given('I have {string} and {string} in my cart', async function (this: CustomWorld, product1: string, product2: string) {
    await this.page.goto(HOME_URL);
    await locators.addToCartButton(this.page, product1).click();
    await locators.addToCartButton(this.page, product2).click();
});


When('I proceed to checkout', async function (this: CustomWorld) {
    await locators.cartIcon(this.page).click();
    await locators.proceedToCheckoutButton(this.page).click();
    await this.page.waitForURL('**/cart');
});


Then('{string} should be included in the order summary', async function (this: CustomWorld, productName: string) {
    await expect(locators.orderRow(this.page, productName)).toBeVisible();
});


Then('the order total should equal the sum of the individual product totals', async function (this: CustomWorld) {
    const rows = locators.orderRows(this.page);
    const count = await rows.count();
    let sum = 0;

    for (let i = 0; i < count; i++) {
        const totalText = await locators.rowTotal(rows.nth(i)).textContent();
        if (totalText) sum += parseInt(totalText);
    }

    const displayedTotal = await locators.displayedTotal(this.page).textContent();
    expect(parseInt(displayedTotal || '0')).toBe(sum);
});
