import { test, expect } from '@playwright/test';
import { openMobileMenu } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Desktop', () => {
    test.skip(({ isMobile }) => isMobile, 'Desktop-only tests');

    test('1.1 Logo is visible and links to #', async ({ page }) => {
      const logo = page.locator('.nav-logo');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('href', '#');
    });

    test('1.2 All nav links are present', async ({ page }) => {
      const links = ['Home', 'About', 'Projects', 'Enterprise', 'FAQ', 'Contact'];
      for (const linkText of links) {
        const link = page.locator(`.nav-links a:has-text("${linkText}")`);
        await expect(link).toBeVisible();
      }
    });

    test('1.3 "Hire Me →" CTA button is visible', async ({ page }) => {
      const cta = page.locator('.nav-cta');
      await expect(cta).toBeVisible();
      await expect(cta).toHaveAttribute('href', '#contact');
    });

    test('1.4 & 1.5 Navbar adds/removes .scrolled class on scroll', async ({ page }) => {
      const navbar = page.locator('.navbar');
      
      // Initial state
      await expect(navbar).not.toHaveClass(/scrolled/);

      // Scroll down
      await page.evaluate(() => document.querySelector('.site-boundary')?.scrollTo(0, 100));
      await expect(navbar).toHaveClass(/scrolled/);

      // Scroll back to top
      await page.evaluate(() => document.querySelector('.site-boundary')?.scrollTo(0, 0));
      await expect(navbar).not.toHaveClass(/scrolled/);
    });

    test('1.7 Smooth scroll on nav link click', async ({ page }) => {
      // Click 'Projects' link
      // Click 'Projects' link
      await page.locator('.nav-links a[href="#projects"]').click({ force: true });
      
      // Wait for scrolling to finish
      await page.waitForTimeout(1000);
      
      // Wait for scrolling to finish
      await page.waitForTimeout(1000);
      
      // Verify scroll position is > 0
      const scrollY = await page.evaluate(() => document.querySelector('.site-boundary')?.scrollTop || 0);
      expect(scrollY).toBeGreaterThan(0);
    });
  });

  test.describe('Mobile', () => {
    test.skip(({ isMobile }) => !isMobile, 'Mobile-only tests');

    test('2.1 Hamburger button is visible on mobile', async ({ page }) => {
      const hamburger = page.locator('.nav-toggle');
      await expect(hamburger).toBeVisible();
    });

    test('2.2 Hamburger opens the mobile menu', async ({ page }) => {
      await openMobileMenu(page);
    });

    test('2.3 All nav links visible in mobile menu', async ({ page }) => {
      await openMobileMenu(page);
      const links = ['Home', 'About', 'Projects', 'Enterprise', 'FAQ', 'Contact'];
      for (const linkText of links) {
        const link = page.locator(`.nav-links a:has-text("${linkText}")`);
        await expect(link).toBeVisible();
      }
    });

    test('2.5 Clicking a nav link closes mobile menu', async ({ page }) => {
      await openMobileMenu(page);
      
      // Click 'Projects' link
      // Click 'Projects' link
      await page.locator('.nav-links a:has-text("Projects")').click({ force: true });
      
      // Menu should close
      const navMenuWrapper = page.locator('.nav-menu-wrapper');
      await expect(navMenuWrapper).not.toHaveClass(/active/);
      
      // Wait for scrolling to finish
      await page.waitForTimeout(1000);
      
      // Verify scroll position changes
      const scrollY = await page.evaluate(() => document.querySelector('.site-boundary')?.scrollTop || 0);
      expect(scrollY).toBeGreaterThan(0);
    });
  });
});
