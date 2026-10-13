import { Locator } from '@playwright/test';


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

    async getName(): Promise<string> {
        return (await this.nameLocator.textContent())?.trim() ?? '';
    }

    async setQuantity(qty: number): Promise<void> {
        await this.quantityInput.fill(qty.toString());
    }

    async addToCart(): Promise<void> {
        await this.addToCartButton.click();
    }
}