import { test, expect } from '@playwright/test';

test.describe('15. Responsive Layout Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('15.1 Desktop layout (1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navbar should be full width, no hamburger
    const navLinks = page.locator('.nav-links');
    await expect(navLinks).toBeVisible();
    
    const hamburger = page.locator('.nav-toggle');
    await expect(hamburger).not.toBeVisible();

    // Hero section should have grid-template-columns showing 2 columns
    const hero = page.locator('.hero');
    const heroDisplay = await hero.evaluate((el) => window.getComputedStyle(el).display);
    expect(heroDisplay).toBe('grid');
    
    // Bento grid should have multiple columns
    const bentoGrid = page.locator('.bento-grid');
    const bentoDisplay = await bentoGrid.evaluate((el) => window.getComputedStyle(el).display);
    expect(bentoDisplay).toBe('grid');
  });

  test('15.2 Tablet layout (1024px) - Hero stacks', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Hero section stacks at 1024px
    const hero = page.locator('.hero');
    const heroGridCols = await hero.evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
    // Usually evaluates to '450px' or '1fr' depending on browser rendering, but it's a single value
    expect(heroGridCols.split(' ').length).toBe(1);
  });

  test('15.3 & 15.5 Mobile layout (768px) - Hamburger & Stacked Hero', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Hamburger should be visible
    const hamburger = page.locator('.nav-toggle');
    await expect(hamburger).toBeVisible();
    
    // Nav links should be hidden until hamburger is clicked
    const navMenu = page.locator('.nav-menu-wrapper');
    await expect(navMenu).not.toHaveClass(/active/);
    
    // Click hamburger to open
    await hamburger.click();
    await expect(navMenu).toHaveClass(/active/);
    
    // Verify body scroll lock
    const overflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(overflow).toBe('hidden');
    
    // 15.5 Hero should be stacked (1 column)
    const hero = page.locator('.hero');
    const heroGridCols = await hero.evaluate((el) => window.getComputedStyle(el).gridTemplateColumns);
    expect(heroGridCols.split(' ').length).toBe(1);
  });

  test('15.6 Bento grid stacks on mobile (768px)', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // The first bento item (usually wide) should not have the min-width grid spans active
    const firstBento = page.locator('.bento-item').first();
    const gridColumn = await firstBento.evaluate((el) => window.getComputedStyle(el).gridColumn);
    
    // If it's stacked, grid-column usually falls back to 'auto' or '1 / 2' instead of 'span 8'
    expect(gridColumn).not.toContain('span 8');
  });

  test('15.4 Small mobile (480px) - No horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 844 });
    
    // Check if body scrollWidth exceeds clientWidth (which would indicate horizontal overflow)
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    expect(hasHorizontalScroll).toBe(false);
  });
});
