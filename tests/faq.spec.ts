import { test, expect } from '@playwright/test';
import { scrollToSection } from './helpers';

test.describe('FAQ Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'faq');
  });

  test('12.1 FAQ section heading is visible', async ({ page }) => {
    const heading = page.locator('#faq h2.section-title');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Quick answers.');
  });

  test('12.2 All 4 FAQ items are rendered', async ({ page }) => {
    const faqItems = page.locator('.faq-item');
    await expect(faqItems).toHaveCount(4);
  });

  test('12.3 Expanding one FAQ item closes the others (Accordion behavior)', async ({ page }) => {
    const firstFaq = page.locator('.faq-item').nth(0);
    const secondFaq = page.locator('.faq-item').nth(1);

    // Expand the first FAQ
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open', '');

    // Expand the second FAQ
    await secondFaq.locator('summary').click();
    await expect(secondFaq).toHaveAttribute('open', '');

    // The first one should be closed now
    await expect(firstFaq).not.toHaveAttribute('open', '');
  });

  test('12.4 Icon rotates on expansion', async ({ page }) => {
    const firstFaq = page.locator('.faq-item').nth(0);
    const icon = firstFaq.locator('.faq-icon');
    
    // Default state: not rotated (rotation might not be directly observable via Playwright expect simply,
    // but we can check if the open attribute is applied which drives the CSS transform).
    await expect(firstFaq).not.toHaveAttribute('open', '');
    
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open', '');
    await page.waitForTimeout(500); // Wait for transition
    
    // We can verify that the CSS transform applies by evaluating the computed style
    // When open, the icon has transform: rotate(45deg)
    const transform = await icon.evaluate(el => window.getComputedStyle(el).transform);
    // In Matrix/transform syntax, 45deg is approximately matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)
    // We just verify it's not 'none'
    expect(transform).not.toBe('none');
  });
});
