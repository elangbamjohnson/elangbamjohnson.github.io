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
  // Explicitly scroll the custom scroll container to the element's position
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    const container = document.querySelector('.site-boundary');
    if (el && container) {
      // Calculate position relative to container
      const topPos = el.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top;
      container.scrollTo({ top: topPos, behavior: 'smooth' });
    }
  }, sectionId);
  // Wait a bit for smooth scroll and IntersectionObserver animations
  await page.waitForTimeout(1000);
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
