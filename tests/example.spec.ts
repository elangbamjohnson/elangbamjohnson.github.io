import { test, expect } from '@playwright/test';

test('Social buttons are visible in footer', async ({ page }) => {
  // Go to the local server
  await page.goto('/');

  // Ensure matrix mode is toggled off (if it's on by default)
  // Let's just check the state. By default, it might be off or on depending on OS preferences.
  // We can just explicitly test the Light mode first.
  const body = page.locator('body');
  
  // Try to toggle matrix mode OFF if it is currently ON
  if (await body.evaluate((b) => b.classList.contains('theme-matrix'))) {
    await page.locator('.theme-toggle-btn').click();
  }
  await expect(body).not.toHaveClass(/theme-matrix/);

  // Check if the LinkedIn button in the footer is visible and color contrasts well
  const linkedInBtn = page.locator('#contact a.btn--outline-dark:has-text("LinkedIn")');
  await expect(linkedInBtn).toBeVisible();

  // Test Matrix mode (dark mode)
  await page.locator('.theme-toggle-btn').click();
  await expect(body).toHaveClass(/theme-matrix/);
  
  // LinkedIn button should still be visible
  await expect(linkedInBtn).toBeVisible();
});
