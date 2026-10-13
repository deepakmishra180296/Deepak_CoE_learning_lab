import { Page, Locator } from '@playwright/test';

/**
 * BasePage encapsulates common browser utilities:
 * 1. Page driver reference
 * 2. Standard browser interactions (goto, click, fill, getText)
 * 3. Explicit wait helpers (waitForElement, waitForElementHidden, waitForUrl)
 * 4. Contextual logging (log, logError)
 * 5. Error capture (safeAction wrapper that logs failure context and rethrows)
 *
 * What belongs in BasePage:
 * - Low-level UI interaction wrappers
 * - Generic wait synchronization helpers
 * - Shared logging and error handling
 *
 * What does NOT belong in BasePage:
 * - Application-specific locators (e.g. search box, cart button)
 * - Domain business workflows (e.g. checkoutProduct, login)
 * - Test assertions (e.g. expect(item).toBeVisible())
 */
export abstract class BasePage {
    protected readonly page: Page;
    protected readonly contextName: string;

    constructor(page: Page, contextName?: string) {
        this.page = page;
        this.contextName = contextName ?? this.constructor.name;
    }

    // -------------------------------------------------------------
    // Logging Utilities
    // -------------------------------------------------------------
    protected log(message: string): void {
        console.log(`[INFO] [${this.contextName}] ${message}`);
    }

    protected logError(message: string, error?: unknown): void {
        console.error(`[ERROR] [${this.contextName}] ${message}`, error ?? '');
    }

    // -------------------------------------------------------------
    // Error Capture Utility
    // -------------------------------------------------------------
    /**
     * Executes an async action wrapped in error capture.
     * Logs descriptive context on failure before rethrowing.
     */
    protected async safeAction<T>(action: () => Promise<T>, description: string): Promise<T> {
        try {
            return await action();
        } catch (error) {
            this.logError(`Failed during: ${description}`, error);
            throw error;
        }
    }

    // -------------------------------------------------------------
    // Common Action Utilities
    // -------------------------------------------------------------
    async goto(url: string): Promise<void> {
        this.log(`Navigating to URL: ${url}`);
        await this.safeAction(
            () => this.page.goto(url),
            `Navigating to URL "${url}"`
        );
    }

    async click(locator: Locator, description?: string): Promise<void> {
        const desc = description ?? 'element';
        this.log(`Clicking ${desc}`);
        await this.safeAction(
            () => locator.click(),
            `Clicking on ${desc}`
        );
    }

    async fill(locator: Locator, text: string, description?: string): Promise<void> {
        const desc = description ?? 'input field';
        this.log(`Filling ${desc} with: "${text}"`);
        await this.safeAction(
            () => locator.fill(text),
            `Filling ${desc}`
        );
    }

    async getText(locator: Locator, description?: string): Promise<string> {
        const desc = description ?? 'element';
        return await this.safeAction(
            async () => (await locator.textContent())?.trim() ?? '',
            `Getting text from ${desc}`
        );
    }

    // -------------------------------------------------------------
    // Wait Helpers
    // -------------------------------------------------------------
    async waitForElement(locator: Locator, timeout: number = 10000): Promise<void> {
        await this.safeAction(
            () => locator.waitFor({ state: 'visible', timeout }),
            'Waiting for element visibility'
        );
    }

    async waitForElementHidden(locator: Locator, timeout: number = 10000): Promise<void> {
        await this.safeAction(
            () => locator.waitFor({ state: 'hidden', timeout }),
            'Waiting for element to be hidden'
        );
    }

    async waitForUrl(urlOrPattern: string | RegExp): Promise<void> {
        this.log(`Waiting for URL to match: ${urlOrPattern}`);
        await this.safeAction(
            () => this.page.waitForURL(urlOrPattern),
            `Waiting for URL ${urlOrPattern}`
        );
    }
}