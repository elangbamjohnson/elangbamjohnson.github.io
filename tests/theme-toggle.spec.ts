import { test, expect } from '@playwright/test';
import { ensureLightMode, ensureMatrixMode } from './helpers';

test.describe('Theme Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('3.1 Theme toggle button is visible', async ({ page }) => {
    const toggleBtn = page.locator('#theme-toggle');
    await expect(toggleBtn).toBeVisible();
  });

  test('3.2 Toggle label says "Enter the Matrix" by default', async ({ page }) => {
    await ensureLightMode(page);
    const label = page.locator('#theme-toggle .toggle-label');
    await expect(label).toHaveText('Enter the Matrix');
  });

  test('3.3 Clicking toggle activates Matrix mode', async ({ page }) => {
    await ensureLightMode(page);
    const toggleBtn = page.locator('#theme-toggle');
    await toggleBtn.click();
    
    const body = page.locator('body');
    await expect(body).toHaveClass(/theme-matrix/);
    const html = page.locator('html');
    await expect(html).toHaveClass(/theme-matrix/);
  });

  test('3.4 Toggle label changes to "Exit the Matrix"', async ({ page }) => {
    await ensureMatrixMode(page);
    const label = page.locator('#theme-toggle .toggle-label');
    await expect(label).toHaveText('Exit the Matrix');
  });

  test('3.5 Clicking toggle again deactivates Matrix mode', async ({ page }) => {
    await ensureMatrixMode(page);
    const toggleBtn = page.locator('#theme-toggle');
    await toggleBtn.click();
    
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/theme-matrix/);
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/theme-matrix/);
  });

  test('3.6 Theme persists in localStorage', async ({ page }) => {
    await ensureMatrixMode(page);
    
    const theme = await page.evaluate(() => localStorage.getItem('site-theme'));
    expect(theme).toBe('matrix');

    await ensureLightMode(page);
    const themeLight = await page.evaluate(() => localStorage.getItem('site-theme'));
    expect(themeLight).toBe('light');
  });

  test('3.7 Theme loads from localStorage on refresh', async ({ page }) => {
    await ensureMatrixMode(page);
    
    // Refresh page
    await page.reload();
    
    const body = page.locator('body');
    await expect(body).toHaveClass(/theme-matrix/);
  });

  test('17.1 & 17.2 Cross-theme basic checks', async ({ page }) => {
    // Check light mode
    await ensureLightMode(page);
    let descColor = await page.evaluate(() => window.getComputedStyle(document.querySelector('.hero-desc')).color);
    // Should be dark text on light bg (rgb(26, 27, 46) is #1A1B2E)
    expect(descColor).toBe('rgba(26, 27, 46, 0.6)');

    // Check Matrix mode
    await ensureMatrixMode(page);
    descColor = await page.evaluate(() => window.getComputedStyle(document.querySelector('.hero-desc')).color);
    // Should be light text on dark bg (rgb(240, 245, 241) is #F0F5F1)
    expect(descColor).toBe('rgb(240, 245, 241)');
  });
});
