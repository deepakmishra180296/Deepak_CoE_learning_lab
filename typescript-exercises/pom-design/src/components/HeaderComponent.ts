import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';

/**
 * HeaderComponent represents the shared navigation header on GreenKart:
 * cart icon, item count indicator, and the expandable cart preview drawer.
 * Extends BasePage to leverage common actions, logging, wait helpers, and error capture.
 */
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

    /**
     * Reads the total item count shown in the header cart badge
     */
    async getCartItemCount(): Promise<number> {
        const text = await this.getText(this.cartInfoItems, 'Cart badge count');
        return parseInt(text || '0', 10);
    }

    /**
     * Clicks the cart icon to open the cart preview drawer
     */
    async openCartPreview(): Promise<void> {
        await this.click(this.cartIcon, 'Cart icon');
        await this.waitForElement(this.cartPreview);
    }

    /**
     * Checks if a product appears inside the cart preview drawer
     */
    async isProductInCartPreview(productName: string): Promise<boolean> {
        await this.openCartPreview();
        const item = this.cartItems.filter({ hasText: productName });
        return await item.isVisible();
    }

    /**
     * Clicks Proceed to Checkout and waits for the checkout page URL
     */
    async proceedToCheckout(): Promise<void> {
        await this.openCartPreview();
        await this.click(this.proceedToCheckoutButton, 'PROCEED TO CHECKOUT button');
        await this.waitForUrl('**/cart');
    }
}