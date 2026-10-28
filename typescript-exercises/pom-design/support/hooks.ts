// Global setup and teardown for Cucumber scenarios
import { Before, After, BeforeAll, AfterAll, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { CheckoutPage } from '../src/pages/CheckoutPage';

setDefaultTimeout(30 * 1000);

export class CustomWorld {
    browser!: Browser;
    context!: BrowserContext;
    page!: Page;
    homePage!: HomePage;
    checkoutPage!: CheckoutPage;
}

setWorldConstructor(CustomWorld);

let browser: Browser;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});

Before(async function (this: CustomWorld) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
    this.homePage = new HomePage(this.page);
    this.checkoutPage = new CheckoutPage(this.page);
});

After(async function (this: CustomWorld) {
    await this.page.close();
    await this.context.close();
});

AfterAll(async function () {
    await browser.close();
});
