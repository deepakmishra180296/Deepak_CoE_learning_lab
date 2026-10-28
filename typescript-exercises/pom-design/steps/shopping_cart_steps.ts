import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/hooks';
import { TestDataFactory } from '../src/data/TestDataFactory';

Given('I am on the GreenKart storefront', async function (this: CustomWorld) {
    await this.homePage.open();
});

When('I add {string} to my cart', async function (this: CustomWorld, productName: string) {
    const product = TestDataFactory.createProduct(productName);
    await this.homePage.addProductToCart(product.name);
});

Then('{string} should be included in my cart', async function (this: CustomWorld, productName: string) {
    expect(await this.homePage.header.isProductInCartPreview(productName)).toBeTruthy();
});

Then('my cart should contain {int} item(s)', async function (this: CustomWorld, count: number) {
    expect(await this.homePage.header.getCartItemCount()).toBe(count);
});
