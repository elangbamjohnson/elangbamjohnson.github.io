import { test, expect } from '@playwright/test';

test.describe('Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('4.1 Title and subtitle are visible', async ({ page }) => {
    const title = page.locator('.hero-title');
    const subtitle = page.locator('.hero-subtitle');
    
    await expect(title).toBeVisible();
    await expect(title).toContainText('Johnson Elangbam');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toContainText('Senior / Staff iOS Engineer');
  });

  test('4.2 Profile image is visible', async ({ page }) => {
    const profileImg = page.locator('.hero-image img, .hero-visual img');
    await expect(profileImg).toBeVisible();
    await expect(profileImg).toHaveAttribute('alt', 'Johnson Elangbam');
  });

  test('4.3 Download Resume button is visible and works', async ({ page }) => {
    const resumeBtn = page.locator('.hero-content .btn--navy');
    await expect(resumeBtn).toBeVisible();
    await expect(resumeBtn).toContainText('Download Resume');
    await expect(resumeBtn).toHaveAttribute('href', /.*\.pdf/);
  });

  test('4.4 "Available for work" status badge is visible', async ({ page }) => {
    const statusBadge = page.locator('.status-badge');
    await expect(statusBadge).toBeVisible();
    await expect(statusBadge).toContainText('Available for work');
  });

  test('4.5 & 4.6 CTA pills link to #contact', async ({ page }) => {
    const pills = page.locator('.hero-actions .btn--pill-outline');
    
    // Ensure we have at least 1 pill to test
    const count = await pills.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      await expect(pills.nth(i)).toHaveAttribute('href', '#contact');
    }
  });

  test('4.7 & 4.8 Float cards are present around the hero image', async ({ page }) => {
    // 99% Crash-free rate card
    const tlCard = page.locator('.float-card--tl');
    await expect(tlCard).toBeVisible();
    await expect(tlCard).toContainText('99%');
    
    // 30-70% Build time faster card
    const brCard = page.locator('.float-card--br');
    await expect(brCard).toBeVisible();
    await expect(brCard).toContainText('30-70%');
  });
});
