import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';


export class HeaderComponent extends BasePage {
    readonly cartIcon: Locator;
    readonly cartInfoItems: Locator;
    readonly cartPreview: Locator;
    readonly cartItems: Locator;
    readonly proceedToCheckoutButton: Locator;

    constructor(page: Page) {
        super(page, 'HeaderComponent');
        this.cartIcon = page.locator('.cart-icon img');
        this.cartInfoItems = page.locator('.cart-info table tr').nth(0).locator('strong');
        this.cartPreview = page.locator('.cart-preview');
        this.cartItems = page.locator('.cart-preview .cart-item');
        this.proceedToCheckoutButton = page.locator('button', { hasText: 'PROCEED TO CHECKOUT' });
    }


    async getCartItemCount(): Promise<number> {
        const text = await this.getText(this.cartInfoItems, 'Cart badge count');
        return parseInt(text || '0', 10);
    }


    async openCartPreview(): Promise<void> {
        await this.click(this.cartIcon, 'Cart icon');
        await this.waitForElement(this.cartPreview);
    }


    async isProductInCartPreview(productName: string): Promise<boolean> {
        await this.openCartPreview();
        const item = this.cartItems.filter({ hasText: productName });
        return await item.isVisible();
    }

    async proceedToCheckout(): Promise<void> {
        await this.openCartPreview();
        await this.click(this.proceedToCheckoutButton, 'PROCEED TO CHECKOUT button');
        await this.waitForUrl('**/cart');
    }
}