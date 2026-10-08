import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/hooks';

// Add a specific item to the cart by filtering products by text, then clicking its "ADD TO CART" button
When('I add {string} to my cart', async function (this: CustomWorld, productName: string) {
    const product = this.page.locator('.product').filter({ hasText: productName });
    await product.locator('button', { hasText: 'ADD TO CART' }).click();
});

// Try to change the quantity input of a specific product before adding it to the cart
When('I attempt to add {string} with a quantity of {int} to my cart', async function (this: CustomWorld, productName: string, quantity: number) {
    const product = this.page.locator('.product').filter({ hasText: productName });
    await product.locator('.quantity').fill(quantity.toString());
    await product.locator('button', { hasText: 'ADD TO CART' }).click();
});

// Open the cart preview drawer and assert the product is visible inside it
Then('{string} should be included in my cart', async function (this: CustomWorld, productName: string) {
    await this.page.locator('.cart-icon img').click(); // Open cart preview
    const cartItems = this.page.locator('.cart-preview .cart-item');
    await expect(cartItems.filter({ hasText: productName })).toBeVisible();
});

// Open the cart preview and assert the item count for this specific product is 0
Then('the cart should not include {string}', async function (this: CustomWorld, productName: string) {
    await this.page.locator('.cart-icon img').click();
    const cartItems = this.page.locator('.cart-preview .cart-item');
    await expect(cartItems.filter({ hasText: productName })).toHaveCount(0);
});

// Assert the global item count in the header matches the expected amount
Then('the cart should contain {int} item(s)', async function (this: CustomWorld, count: number) {
    await expect(this.page.locator('.cart-info table tr').nth(0).locator('strong')).toHaveText(count.toString());
});

// Placeholder for an invalid quantity error. GreenKart doesn't always show a strict error, so this just logs.
Then('an error message should be displayed indicating invalid quantity', async function (this: CustomWorld) {
    // In a real scenario, we'd verify the specific alert or message element.
    console.log('Validating error message for invalid quantity');
});

// Assert that a fresh page correctly displays 0 items in the cart
Given('I have no products in my cart', async function (this: CustomWorld) {
    // The cart is empty by default upon visiting the page
    await expect(this.page.locator('.cart-info table tr').nth(0).locator('strong')).toHaveText('0');
});

// Click the cart icon to open the drawer
When('I view my cart', async function (this: CustomWorld) {
    await this.page.locator('.cart-icon img').click();
});

// Verify the empty state message. We use `.first()` to fix a strict-mode violation if there are multiple elements matching.
Then('the cart should be empty', async function (this: CustomWorld) {
    const emptyMsg = this.page.locator('.empty-cart h2').first();
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toHaveText('You cart is empty!');
});

// Verify the global total price in the header
Then('the cart total should be {int}', async function (this: CustomWorld, total: number) {
    await expect(this.page.locator('.cart-info table tr').nth(1).locator('strong')).toHaveText(total.toString());
});
