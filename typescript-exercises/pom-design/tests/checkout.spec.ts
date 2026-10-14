import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { CheckoutPage } from '../src/pages/CheckoutPage';
import { TestDataFactory } from '../src/data/TestDataFactory';

test.describe('GreenKart Storefront - Checkout Flow', () => {

    test('TestCase 2: Proceed to checkout with a single product and verify in order summary', async ({ page }) => {
        
        const homePage = new HomePage(page);
        const checkoutPage = new CheckoutPage(page);

        
        const testProduct = TestDataFactory.createProduct('Cucumber', 1);

        
        await homePage.open();
        await homePage.addProductToCart(testProduct.name);

       
        await homePage.header.proceedToCheckout();

        
        await checkoutPage.waitForLoad();

        
        const isInSummary = await checkoutPage.isProductInSummary(testProduct.name);
        expect(isInSummary).toBeTruthy();

        
        const total = await checkoutPage.getDisplayedTotal();
        expect(total).toBeGreaterThan(0);
    });

});