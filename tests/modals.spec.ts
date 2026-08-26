import { test, expect } from '@playwright/test';
import { scrollToSection } from './helpers';

test.describe('Modals (Video & Case Study)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'projects');
  });

  test.describe('Video Modal', () => {
    test('7.1 & 7.2 Open video modal and check ARIA', async ({ page }) => {
      const watchDemoBtn = page.locator('button:has-text("Watch Demo")');
      await watchDemoBtn.click();

      const modal = page.locator('#videoModal');
      await expect(modal).toHaveClass(/active/);
      await expect(modal).toHaveAttribute('aria-hidden', 'false');

      const video = modal.locator('video#demoVideo');
      await expect(video).toBeVisible();
    });

    test('7.3 Close video modal via X button', async ({ page }) => {
      await page.locator('button:has-text("Watch Demo")').click();
      
      const modal = page.locator('#videoModal');
      await expect(modal).toHaveClass(/active/);

      // Dispatch click directly via JS to avoid cross-browser flakiness with animated modals
      await page.evaluate(() => document.getElementById('closeVideoBtn')?.click());

      await expect(modal).not.toHaveClass(/active/);
      await expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    test('7.4 Close video modal via backdrop click', async ({ page }) => {
      await page.locator('button:has-text("Watch Demo")').click();
      
      const modal = page.locator('#videoModal');
      await expect(modal).toHaveClass(/active/);

      // Dispatch click on the backdrop element directly
      await page.evaluate(() => document.getElementById('videoModal')?.click());
      
      await expect(modal).not.toHaveClass(/active/);
    });

    test('7.5 Close video modal via Escape key', async ({ page }) => {
      await page.locator('button:has-text("Watch Demo")').click();
      
      const modal = page.locator('#videoModal');
      await expect(modal).toHaveClass(/active/);

      await page.keyboard.press('Escape');

      await expect(modal).not.toHaveClass(/active/);
    });
  });

  test.describe('Case Study Modal', () => {
    test('8.1 & 8.2 Open Case Study modal and check content', async ({ page }) => {
      const caseStudyBtn = page.locator('button[aria-label="Read AIAnalyzer case study"]');
      await caseStudyBtn.click();

      const modal = page.locator('#caseStudyModal');
      await expect(modal).toHaveClass(/active/);
      await expect(modal).toHaveAttribute('aria-hidden', 'false');

      const title = modal.locator('.case-study-title');
      await expect(title).toBeVisible();
      await expect(title).toContainText('AIAnalyzer');
    });

    test('8.3 Close Case Study modal via X button', async ({ page }) => {
      await page.locator('button[aria-label="Read AIAnalyzer case study"]').click();
      
      const modal = page.locator('#caseStudyModal');
      // Dispatch click directly via JS to avoid cross-browser flakiness with animated modals
      await page.evaluate(() => document.getElementById('closeCaseStudyBtn')?.click());

      await expect(modal).not.toHaveClass(/active/);
    });

    test('8.4 Close Case Study modal via bottom Close Case Study button', async ({ page }) => {
      await page.locator('button[aria-label="Read AIAnalyzer case study"]').click();
      
      const modal = page.locator('#caseStudyModal');
      await expect(modal).toHaveClass(/active/);

      const bottomBtn = modal.locator('button:has-text("Close Case Study")');
      await bottomBtn.scrollIntoViewIfNeeded();
      await bottomBtn.click();

      await expect(modal).not.toHaveClass(/active/);
    });

    test('8.5 Close Case Study modal via backdrop click', async ({ page }) => {
      await page.locator('button[aria-label="Read AIAnalyzer case study"]').click();
      
      const modal = page.locator('#caseStudyModal');
      await expect(modal).toHaveClass(/active/);
      
      // Dispatch click on the backdrop element directly to avoid coordinate issues
      await page.evaluate(() => document.getElementById('caseStudyModal')?.click());
      
      await expect(modal).not.toHaveClass(/active/);
    });

    test('8.6 Close Case Study modal via Escape key', async ({ page }) => {
      await page.locator('button[aria-label="Read AIAnalyzer case study"]').click();
      
      const modal = page.locator('#caseStudyModal');
      await page.keyboard.press('Escape');
      
      await expect(modal).not.toHaveClass(/active/);
    });

    test('8.7 Read full technical write-up link in Case Study modal', async ({ page }) => {
      await page.locator('button[aria-label="Read AIAnalyzer case study"]').click();
      
      const modal = page.locator('#caseStudyModal');
      const viewWriteUpBtn = modal.locator('a:has-text("Read the full technical write-up")');
      
      await expect(viewWriteUpBtn).toBeVisible();
      await expect(viewWriteUpBtn).toHaveAttribute('href', /dev\.to/);
    });
  });
});
