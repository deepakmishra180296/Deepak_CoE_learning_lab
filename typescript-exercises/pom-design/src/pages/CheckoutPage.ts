import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { HeaderComponent } from '../components/HeaderComponent';


export class CheckoutPage extends BasePage {
    readonly header: HeaderComponent;
    readonly cartTable: Locator;
    readonly cartRows: Locator;
    readonly totalAmount: Locator;

    constructor(page: Page) {
        super(page, 'CheckoutPage');
        this.header = new HeaderComponent(page);
        this.cartTable = page.locator('table.cartTable');
        this.cartRows = page.locator('table.cartTable tbody tr');
        this.totalAmount = page.locator('.totAmt');
    }

    async waitForLoad(): Promise<void> {
        await this.waitForElement(this.cartTable);
    }

    async isProductInSummary(productName: string): Promise<boolean> {
        const matchingRow = this.cartRows.filter({ hasText: productName });
        return await matchingRow.isVisible();
    }

    async getDisplayedTotal(): Promise<number> {
        const text = await this.getText(this.totalAmount, 'Total order amount');
        return parseInt(text || '0', 10);
    }
}