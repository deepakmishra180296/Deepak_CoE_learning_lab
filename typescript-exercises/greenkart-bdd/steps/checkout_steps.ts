import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/hooks';

// Navigate to the homepage
Given('I have {string} in my cart', async function (this: CustomWorld, productName: string) {
    await this.page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    const product = this.page.locator('.product').filter({ hasText: productName });
    await product.locator('button', { hasText: 'ADD TO CART' }).click();
});

// Navigate and add two different items sequentially.
Given('I have {string} and {string} in my cart', async function (this: CustomWorld, product1: string, product2: string) {
    await this.page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
    await this.page.locator('.product').filter({ hasText: product1 }).locator('button', { hasText: 'ADD TO CART' }).click();
    await this.page.locator('.product').filter({ hasText: product2 }).locator('button', { hasText: 'ADD TO CART' }).click();
});

// Open the cart preview and click the checkout button
When('I proceed to checkout', async function (this: CustomWorld) {
    await this.page.locator('.cart-icon img').click();
    await this.page.locator('button', { hasText: 'PROCEED TO CHECKOUT' }).click();
    await this.page.waitForURL('**/cart');
});

// Assert that the specified product is present in the checkout order summary table
Then('{string} should be included in the order summary', async function (this: CustomWorld, productName: string) {
    const table = this.page.locator('table.cartTable');
    await expect(table.locator('tbody tr').filter({ hasText: productName })).toBeVisible();
});

// Calculate the sum of individual rows and verify it matches the grand total displayed on the checkout page
Then('the order total should equal the sum of the individual product totals', async function (this: CustomWorld) {
    const rows = this.page.locator('table.cartTable tbody tr');
    const count = await rows.count();
    let sum = 0;

    for (let i = 0; i < count; i++) {
        const totalText = await rows.nth(i).locator('td').nth(4).textContent();
        if (totalText) sum += parseInt(totalText);
    }

    const displayedTotal = await this.page.locator('.totAmt').textContent();
    expect(parseInt(displayedTotal || '0')).toBe(sum);
});
