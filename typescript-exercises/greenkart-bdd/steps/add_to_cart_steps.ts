import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { CustomWorld } from '../support/hooks';

const locators = {
    productCard: (page: Page, productName: string) => page.locator('.product').filter({ hasText: productName }),
    addToCartButton: (page: Page, productName: string) =>
        locators.productCard(page, productName).getByRole('button', { name: 'ADD TO CART' }),
    cartIcon: (page: Page) => page.locator('a.cart-icon'),
    cartPreviewItems: (page: Page, productName: string) =>
        page.locator('.cart-preview .cart-item').filter({ hasText: productName }),
    cartSummaryValue: (page: Page, label: 'Items' | 'Price') =>
        page.locator('.cart-info tr').filter({ hasText: label }).locator('strong'),
    emptyCartMessage: (page: Page) => page.locator('.empty-cart h2').first(),
};

When('I add {string} to my cart', async function (this: CustomWorld, productName: string) {
    await locators.addToCartButton(this.page, productName).click();
});

Then('{string} should be included in my cart', async function (this: CustomWorld, productName: string) {
    await locators.cartIcon(this.page).click(); // Open cart preview
    await expect(locators.cartPreviewItems(this.page, productName)).toBeVisible();
});

Then('the cart should contain {int} item(s)', async function (this: CustomWorld, count: number) {
    await expect(locators.cartSummaryValue(this.page, 'Items')).toHaveText(count.toString());
});

Given('I have no products in my cart', async function (this: CustomWorld) {
    await expect(locators.cartSummaryValue(this.page, 'Items')).toHaveText('0');
});

When('I view my cart', async function (this: CustomWorld) {
    await locators.cartIcon(this.page).click();
});

Then('the cart should be empty', async function (this: CustomWorld) {
    const emptyMsg = locators.emptyCartMessage(this.page);
    await expect(emptyMsg).toBeVisible();
    await expect(emptyMsg).toHaveText('You cart is empty!');
});

Then('the cart total should be {int}', async function (this: CustomWorld, total: number) {
    await expect(locators.cartSummaryValue(this.page, 'Price')).toHaveText(total.toString());
});
