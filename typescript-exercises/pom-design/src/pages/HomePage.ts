import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { HeaderComponent } from '../components/HeaderComponent';
import { ProductCardComponent } from '../components/ProductCardComponent';


export class HomePage extends BasePage {
    static readonly URL = 'https://rahulshettyacademy.com/seleniumPractise/#/';
    readonly header: HeaderComponent;
    readonly productCards: Locator;

    constructor(page: Page) {
        super(page, 'HomePage');
        this.header = new HeaderComponent(page);
        this.productCards = page.locator('.products .product');
    }

    async open(): Promise<void> {
        await this.goto(HomePage.URL);
        await this.waitForElement(this.productCards.first());
    }

    getProductCard(productName: string): ProductCardComponent {
        const cardLocator = this.productCards.filter({ hasText: productName });
        return new ProductCardComponent(cardLocator);
    }

    async addProductToCart(productName: string): Promise<void> {
        const card = this.getProductCard(productName);
        await card.addToCart();
    }
}