import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/hooks';


Given('I am on the GreenKart home page', async function (this: CustomWorld) {
    await this.page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
});


When('I search for {string}', async function (this: CustomWorld, productName: string) {
    await this.page.locator('.search-keyword').fill(productName);
    await this.page.waitForTimeout(1000);
});


Then('{string} should be displayed in the search results', async function (this: CustomWorld, productName: string) {
    const products = this.page.locator('h4.product-name');
    const count = await products.count();
    let found = false;

    for (let i = 0; i < count; i++) {
        const text = await products.nth(i).textContent();
        if (text && text.includes(productName)) {
            found = true;
            break;
        }
    }
   
    expect(found).toBeTruthy();
});


Then('products matching {string} should be displayed in the search results', async function (this: CustomWorld, keyword: string) {
    const products = this.page.locator('h4.product-name');
    const count = await products.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
        const text = await products.nth(i).textContent();
        expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
    }
});

Then('no products should be displayed in the search results', async function (this: CustomWorld) {
    await expect(this.page.locator('.product:visible')).toHaveCount(0);
});
