// Global setup and teardown file for Cucumber scenarios
import { Before, After, BeforeAll, AfterAll, setWorldConstructor, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, BrowserContext, Page } from 'playwright';


setDefaultTimeout(60 * 1000);


export class CustomWorld {
    page!: Page;
    context!: BrowserContext;
    browser!: Browser;
    dialogs: string[] = [];
}


setWorldConstructor(CustomWorld);

let browser: Browser;


BeforeAll(async function () {
    browser = await chromium.launch({ headless: true });
});


Before(async function (this: CustomWorld) {
    this.context = await browser.newContext();
    await this.context.tracing.start({ screenshots: true, snapshots: true });
    this.context.setDefaultTimeout(15 * 1000);
    this.context.setDefaultNavigationTimeout(30 * 1000);
    this.page = await this.context.newPage();
    this.dialogs = [];
    // Playwright auto-dismisses dialogs silently; record each one so it is visible
    this.page.on('dialog', async (dialog) => {
        const entry = `[dialog:${dialog.type()}] ${dialog.message()}`;
        console.warn(entry);
        this.dialogs.push(entry);
        await dialog.dismiss();
    });
});

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

AfterAll(async function () {
    await browser.close();
});
