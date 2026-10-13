import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { TestDataFactory } from '../src/data/TestDataFactory';

test.describe('GreenKart Storefront - Checkout Flow', () => {

    test('TestCase 2: Proceed to checkout with a single product and verify in order summary', async ({ page }) => {
        // 1. Initialize Page Objects
        const homePage = new HomePage(page);
        const checkoutPage = new CheckoutPage(page);

        // 2. Prepare test data via Factory and Builder
        const testProduct = TestDataFactory.createProduct('Cucumber', 1);

        // 3. Navigate and add product to cart
        await homePage.open();
        await homePage.addProductToCart(testProduct.name);

        // 4. Proceed to checkout via Header Component
        await homePage.header.proceedToCheckout();

        // 5. Verify Checkout Page loaded and table is visible
        await checkoutPage.waitForLoad();

        // 6. Assert product appears in the order summary table
        const isInSummary = await checkoutPage.isProductInSummary(testProduct.name);
        expect(isInSummary).toBeTruthy();

        // 7. Assert order total is greater than 0
        const total = await checkoutPage.getDisplayedTotal();
        expect(total).toBeGreaterThan(0);
    });

});