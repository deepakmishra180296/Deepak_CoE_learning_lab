import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { CustomWorld } from '../support/hooks';

const HOME_URL = 'https://rahulshettyacademy.com/seleniumPractise/#/';

const locators = {
    searchInput: (page: Page) => page.locator('.search-keyword'),
    productNames: (page: Page) => page.locator('h4.product-name'),
    visibleProducts: (page: Page) => page.locator('.product:visible'),
};

Given('I am on the GreenKart home page', async function (this: CustomWorld) {
    await this.page.goto(HOME_URL);
});


When('I search for {string}', async function (this: CustomWorld, productName: string) {
    await locators.searchInput(this.page).fill(productName);
    await this.page.waitForTimeout(1000);
});


Then('{string} should be displayed in the search results', async function (this: CustomWorld, productName: string) {
    const names = await locators.productNames(this.page).allTextContents();
    expect(names.some(name => name.includes(productName))).toBeTruthy();
});


Then('products matching {string} should be displayed in the search results', async function (this: CustomWorld, keyword: string) {
    const names = await locators.productNames(this.page).allTextContents();

    expect(names.length).toBeGreaterThan(0);

    for (const name of names) {
        expect(name.toLowerCase()).toContain(keyword.toLowerCase());
    }
});

Then('no products should be displayed in the search results', async function (this: CustomWorld) {
    await expect(locators.visibleProducts(this.page)).toHaveCount(0);
});
