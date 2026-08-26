import { Page, expect } from '@playwright/test';

/**
 * Ensures the site is in light mode (Matrix mode is OFF)
 */
export async function ensureLightMode(page: Page) {
  const body = page.locator('body');
  if (await body.evaluate((b) => b.classList.contains('theme-matrix'))) {
    await page.locator('.theme-toggle-btn').click();
  }
  await expect(body).not.toHaveClass(/theme-matrix/);
}

/**
 * Ensures the site is in Matrix mode (Matrix mode is ON)
 */
export async function ensureMatrixMode(page: Page) {
  const body = page.locator('body');
  if (!(await body.evaluate((b) => b.classList.contains('theme-matrix')))) {
    await page.locator('.theme-toggle-btn').click();
  }
  await expect(body).toHaveClass(/theme-matrix/);
}

/**
 * Scrolls to a section by its ID and ensures it is visible
 */
export async function scrollToSection(page: Page, sectionId: string) {
  const section = page.locator(`#${sectionId}`);
  await section.scrollIntoViewIfNeeded();
  await expect(section).toBeVisible();
}

/**
 * Opens the mobile hamburger menu (for mobile viewport tests)
 */
export async function openMobileMenu(page: Page) {
  const hamburger = page.locator('.nav-toggle');
  if (!(await hamburger.evaluate((btn) => btn.classList.contains('active')))) {
    await hamburger.click();
  }
  const navMenuWrapper = page.locator('.nav-menu-wrapper');
  await expect(navMenuWrapper).toHaveClass(/active/);
}
