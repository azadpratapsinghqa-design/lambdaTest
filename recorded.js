import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.amazon.in/');
  await page.getByRole('searchbox', { name: 'Search Amazon.in' }).click();
  await page.getByRole('searchbox', { name: 'Search Amazon.in' }).fill('Galaxy');
  await page.getByRole('searchbox', { name: 'Search Amazon.in' }).press('Enter');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Galaxy M07 Mobile (Black, 4GB' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('button', { name: 'Add to cart' }).click();
});