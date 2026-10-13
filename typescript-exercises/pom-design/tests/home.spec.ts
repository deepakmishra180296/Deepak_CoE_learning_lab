import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { TestDataFactory } from '../src/data/TestDataFactory';

test.describe('GreenKart Storefront - Shopping Cart', () => {

    test('TestCase 1: Add a single product to cart and verify in cart preview', async ({ page }) => {
        // 1. Initialize Page Object
        const homePage = new HomePage(page);

        // 2. Prepare test data via Factory and Builder
        const testProduct = TestDataFactory.createDefaultProduct();

        // 3. Navigate to GreenKart home page
        await homePage.open();

        // 4. Add the product to cart
        await homePage.addProductToCart(testProduct.name);

        // 5. Verify product appears in the cart preview drawer (Component Object)
        const isIncluded = await homePage.header.isProductInCartPreview(testProduct.name);
        expect(isIncluded).toBeTruthy();

        // 6. Verify header cart badge shows 1 item
        const itemCount = await homePage.header.getCartItemCount();
        expect(itemCount).toBe(1);
    });

});