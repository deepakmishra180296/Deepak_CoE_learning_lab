import { Locator } from '@playwright/test';

/**
 * ProductCardComponent encapsulates locators and actions for an individual
 * product card on the catalog grid.
 */
export class ProductCardComponent {
    private readonly root: Locator;
    readonly nameLocator: Locator;
    readonly quantityInput: Locator;
    readonly addToCartButton: Locator;

    constructor(rootLocator: Locator) {
        this.root = rootLocator;
        this.nameLocator = this.root.locator('h4.product-name');
        this.quantityInput = this.root.locator('.quantity');
        this.addToCartButton = this.root.locator('button', { hasText: 'ADD TO CART' });
    }

    /**
     * Reads product title text
     */
    async getName(): Promise<string> {
        return (await this.nameLocator.textContent())?.trim() ?? '';
    }

    /**
     * Sets quantity in the card input box
     */
    async setQuantity(qty: number): Promise<void> {
        await this.quantityInput.fill(qty.toString());
    }

    /**
     * Clicks ADD TO CART button on this specific card
     */
    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }
}