import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/hooks';

// Navigate to the homepage.
Given('I am on the GreenKart home page', async function (this: CustomWorld) {
    await this.page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
});

// Type the search term into the search bar
When('I search for {string}', async function (this: CustomWorld, productName: string) {
    await this.page.locator('.search-keyword').fill(productName);
    await this.page.waitForTimeout(1000);
});

// Verify that the exact product name appears in the search results
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
    // Assert that we found the product
    expect(found).toBeTruthy();
});

// Verify that all returned products contain the partial keyword we searched for
Then('products matching {string} should be displayed in the search results', async function (this: CustomWorld, keyword: string) {
    const products = this.page.locator('h4.product-name');
    const count = await products.count();

    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
        const text = await products.nth(i).textContent();
        expect(text?.toLowerCase()).toContain(keyword.toLowerCase());
    }
});

// Verify that the empty state is correct when a product doesn't exist
Then('no products should be displayed in the search results', async function (this: CustomWorld) {
    await expect(this.page.locator('.product:visible')).toHaveCount(0);
});
