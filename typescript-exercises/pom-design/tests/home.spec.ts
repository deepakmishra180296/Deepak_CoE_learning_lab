import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/HomePage';
import { TestDataFactory } from '../src/data/TestDataFactory';

test.describe('GreenKart Storefront - Shopping Cart', () => {

    test('TestCase 1: Add a single product to cart and verify in cart preview', async ({ page }) => {
        
        const homePage = new HomePage(page);

        
        const testProduct = TestDataFactory.createDefaultProduct();

        
        await homePage.open();

        
        await homePage.addProductToCart(testProduct.name);

        
        const isIncluded = await homePage.header.isProductInCartPreview(testProduct.name);
        expect(isIncluded).toBeTruthy();

        
        const itemCount = await homePage.header.getCartItemCount();
        expect(itemCount).toBe(1);
    });

});