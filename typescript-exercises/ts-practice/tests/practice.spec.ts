import { test, expect } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("https://playwright.dev/");
  await expect(page).toHaveTitle(/Playwright/);
});

test("playlab homepage navigates to locators page", async ({ page }) => {
  await page.goto("https://playwrightlab.github.io");
  await expect(page).toHaveTitle(/PlayLab/);
  await page.getByTestId("nav-locators").click();
  await expect(page).toHaveURL(/locators\.html/);
});
