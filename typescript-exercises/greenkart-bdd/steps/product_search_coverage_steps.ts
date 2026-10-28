import { Given, When, Then } from '@cucumber/cucumber';
import { expect, Page } from '@playwright/test';
import { CustomWorld } from '../support/hooks';

const locators = {
    searchInput: (page: Page) => page.locator('.search-keyword'),
    searchButton: (page: Page) => page.locator('.search-button'),
    productCards: (page: Page) => page.locator('.products .product'),
    productNames: (page: Page) => page.locator('.products .product h4.product-name'),
    emptyState: (page: Page) => page.locator('.products .no-results h2'),
};
const NO_MATCH_CHARACTER = 'x';
const EMPTY_STATE_TEXT = 'Sorry, no products matched your search!';
const CATALOG_SIZE = 30;
const CATALOG_LOAD_TIMEOUT_MS = 15000;
const CATALOG: readonly string[] = [
    'Brocolli - 1 Kg',
    'Cauliflower - 1 Kg',
    'Cucumber - 1 Kg',
    'Beetroot - 1 Kg',
    'Carrot - 1 Kg',
    'Tomato - 1 Kg',
    'Beans - 1 Kg',
    'Brinjal - 1 Kg',
    'Capsicum',
    'Mushroom - 1 Kg',
    'Potato - 1 Kg',
    'Pumpkin - 1 Kg',
    'Corn - 1 Kg',
    'Onion - 1 Kg',
    'Apple - 1 Kg',
    'Banana - 1 Kg',
    'Grapes - 1 Kg',
    'Mango - 1 Kg',
    'Musk Melon - 1 Kg',
    'Orange - 1 Kg',
    'Pears - 1 Kg',
    'Pomegranate - 1 Kg',
    'Raspberry - 1/4 Kg',
    'Strawberry - 1/4 Kg',
    'Water Melon - 1 Kg',
    'Almonds - 1/4 Kg',
    'Pista - 1/4 Kg',
    'Nuts Mixture - 1 Kg',
    'Cashews - 1 Kg',
    'Walnuts - 1/4 Kg',
];

function parseNameList(commaSeparatedNames: string): string[] {
    return commaSeparatedNames.split(', ');
}


Given('the full product catalog has loaded', async function (this: CustomWorld) {
    await expect(locators.productCards(this.page)).toHaveCount(CATALOG_SIZE, { timeout: CATALOG_LOAD_TIMEOUT_MS });
});


When('I type {string} into the product search', async function (this: CustomWorld, searchTerm: string) {
    await locators.searchInput(this.page).fill(searchTerm);
});


When('I type a single backslash into the product search', async function (this: CustomWorld) {
    await locators.searchInput(this.page).fill('\\');
});


Then('the product results should be exactly {string}', async function (this: CustomWorld, expectedNames: string) {
    await expect(locators.productNames(this.page)).toHaveText(parseNameList(expectedNames));
});


Then('no product cards should be shown', async function (this: CustomWorld) {
    await expect(locators.productCards(this.page)).toHaveCount(0);
});


Then('the no-results message should be shown', async function (this: CustomWorld) {
    await expect(locators.emptyState(this.page)).toHaveText(EMPTY_STATE_TEXT);
});


When('I replace the product search with {string}', async function (this: CustomWorld, searchTerm: string) {
    await locators.searchInput(this.page).fill(searchTerm);
});


When('I clear the product search', async function (this: CustomWorld) {
    await locators.searchInput(this.page).fill('');
});


When('I type a product search of {int} characters', async function (this: CustomWorld, length: number) {
    await locators.searchInput(this.page).fill(NO_MATCH_CHARACTER.repeat(length));
});


When('I click the product search button', async function (this: CustomWorld) {
    await locators.searchButton(this.page).click();
});


Then('the product results should be the full catalog', async function (this: CustomWorld) {
    await expect(locators.productNames(this.page)).toHaveText([...CATALOG]);
});


Then('the product results should be every product except {string}', async function (this: CustomWorld, excludedName: string) {
    await expect(locators.productNames(this.page)).toHaveText(CATALOG.filter(name => name !== excludedName));
});
