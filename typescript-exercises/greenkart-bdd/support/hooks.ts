// Global setup and teardown file for Cucumber scenarios
import { Before, After, BeforeAll, AfterAll, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';

// Increase the default timeout to 30 seconds 
setDefaultTimeout(30 * 1000);

// Define a custom World object to share Playwright browser state between steps
export class CustomWorld {
    page!: Page;
    context!: BrowserContext;
    browser!: Browser;
}

// Tell Cucumber to use our custom World
setWorldConstructor(CustomWorld);

let browser: Browser;

// BeforeAll runs once before any scenarios.
BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});

// Before runs before EVERY scenario.
Before(async function (this: CustomWorld) {
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});

// After runs after EVERY scenario.
After(async function (this: CustomWorld) {
    await this.page.close();
    await this.context.close();
});

// AfterAll runs once after all scenarios complete.
AfterAll(async function () {
    await browser.close();
});
