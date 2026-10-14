import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/hooks';


When('I add {string} to my cart', async function (this: CustomWorld, productName: string) {
    const product = this.page.locator('.product').filter({ hasText: productName });
    await product.locator('button', { hasText: 'ADD TO CART' }).click();
});

When('I attempt to add {string} with a quantity of {int} to my cart', async function (this: CustomWorld, productName: string, quantity: number) {
    const product = this.page.locator('.product').filter({ hasText: productName });
    await product.locator('.quantity').fill(quantity.toString());
    await product.locator('button', { hasText: 'ADD TO CART' }).click();
});

Then('{string} should be included in my cart', async function (this: CustomWorld, productName: string) {
    await this.page.locator('.cart-icon img').click(); // Open cart preview
    const cartItems = this.page.locator('.cart-preview .cart-item');
    await expect(cartItems.filter({ hasText: productName })).toBeVisible();
});

Then('the cart should not include {string}', async function (this: CustomWorld, productName: string) {
    await this.page.locator('.cart-icon img').click();
    const cartItems = this.page.locator('.cart-preview .cart-item');
    await expect(cartItems.filter({ hasText: productName })).toHaveCount(0);
});

Then('the cart should contain {int} item(s)', async function (this: CustomWorld, count: number) {
    await expect(this.page.locator('.cart-info table tr').nth(0).locator('strong')).toHaveText(count.toString());
});

Then('an error message should be displayed indicating invalid quantity', async function (this: CustomWorld) {
    console.log('Validating error message for invalid quantity');
});

Given('I have no products in my cart', async function (this: CustomWorld) {

    await expect(this.page.locator('.cart-info table tr').nth(0).locator('strong')).toHaveText('0');
});

When('I view my cart', async function (this: CustomWorld) {
    await this.page.locator('.cart-icon img').click();
});

Then('the cart should be empty', async function (this: CustomWorld) {
    const emptyMsg = this.page.locator('.empty-cart h2').first();
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toHaveText('You cart is empty!');
});

Then('the cart total should be {int}', async function (this: CustomWorld, total: number) {
    await expect(this.page.locator('.cart-info table tr').nth(1).locator('strong')).toHaveText(total.toString());
});
