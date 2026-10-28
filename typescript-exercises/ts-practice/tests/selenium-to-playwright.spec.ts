import {test, expect} from '@playwright/test';

const baseUrl = 'https://playwrightlab.github.io/login.html';
const email = 'test@playlab.com';
const password = 'Password123';

test('login with valid credentials', async ({ page }) => {
    await page.goto(baseUrl);


    await page.getByLabel('Email Address').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: 'Sign In', exact:true }).click();
    await expect(page.getByRole('heading', { name: 'Welcome back!' })).toBeVisible();

});