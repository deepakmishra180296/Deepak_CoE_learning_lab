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
    await this.context.tracing.start({ screenshots: true, snapshots: true });
    this.page = await this.context.newPage();
});

// After runs after EVERY scenario.
After(async function (this: CustomWorld, scenario) {
    if (scenario.result?.status && scenario.result.status.toString() !== 'PASSED') {
        const cleanName = scenario.pickle.name.replace(/[^a-zA-Z0-9]/g, '_');
        await this.context.tracing.stop({ path: `reports/traces/${cleanName}.zip` });
    }else {
        await this.context.tracing.stop();
    }
    await this.page.close();
    await this.context.close();
});

// AfterAll runs once after all scenarios complete.
AfterAll(async function () {
    await browser.close();
});
