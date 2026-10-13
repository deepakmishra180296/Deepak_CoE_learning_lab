import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { HeaderComponent } from '../components/HeaderComponent';
import { ProductCardComponent } from '../components/ProductCardComponent';

/**
 * HomePage represents the GreenKart storefront catalog page.
 * Demonstrates:
 * 1. Extending BasePage for navigation, waits, and error capture
 * 2. Component composition with HeaderComponent
 */
export class HomePage extends BasePage {
    static readonly URL = 'https://rahulshettyacademy.com/seleniumPractise/#/';
    readonly header: HeaderComponent;
    readonly productCards: Locator;

    constructor(page: Page) {
        super(page, 'HomePage');
        this.header = new HeaderComponent(page);
        this.productCards = page.locator('.products .product');
    }

    /**
     * Navigates to GreenKart home page and waits for catalog grid
     */
    async open(): Promise<void> {
        await this.goto(HomePage.URL);
        await this.waitForElement(this.productCards.first());
    }

    /**
     * Returns a ProductCardComponent for the given product name
     */
    getProductCard(productName: string): ProductCardComponent {
        const cardLocator = this.productCards.filter({ hasText: productName });
        return new ProductCardComponent(cardLocator);
    }

    /**
     * Finds product by name and clicks its ADD TO CART button
     */
    async addProductToCart(productName: string): Promise<void> {
        const card = this.getProductCard(productName);
        await card.addToCart();
    }
}