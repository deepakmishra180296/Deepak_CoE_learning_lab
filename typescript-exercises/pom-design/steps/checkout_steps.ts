import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/hooks';
import { TestDataFactory } from '../src/data/TestDataFactory';

Given('I have {string} in my cart', async function (this: CustomWorld, productName: string) {
    const product = TestDataFactory.createProduct(productName);
    await this.homePage.addProductToCart(product.name);
});

When('I proceed to checkout', async function (this: CustomWorld) {
    await this.homePage.header.proceedToCheckout();
    await this.checkoutPage.waitForLoad();
});

Then('{string} should be included in the order summary', async function (this: CustomWorld, productName: string) {
    expect(await this.checkoutPage.isProductInSummary(productName)).toBeTruthy();
});

Then('the order total should be greater than zero', async function (this: CustomWorld) {
    expect(await this.checkoutPage.getDisplayedTotal()).toBeGreaterThan(0);
});
