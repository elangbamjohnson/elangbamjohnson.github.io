import { test, expect } from '@playwright/test';

test.describe('16. SEO & Accessibility Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('16.1 Page has correct <title>', async ({ page }) => {
    await expect(page).toHaveTitle(/Johnson Elangbam \| Senior iOS Engineer/i);
  });

  test('16.2 Meta description exists and has content', async ({ page }) => {
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);
    
    const content = await metaDescription.getAttribute('content');
    expect(content?.length).toBeGreaterThan(10);
  });

  test('16.3 Open Graph tags are present', async ({ page }) => {
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);
    expect(await ogTitle.getAttribute('content')).not.toBeNull();

    const ogDesc = page.locator('meta[property="og:description"]');
    await expect(ogDesc).toHaveCount(1);
    expect(await ogDesc.getAttribute('content')).not.toBeNull();

    const ogImage = page.locator('meta[property="og:image"]');
    await expect(ogImage).toHaveCount(1);
    expect(await ogImage.getAttribute('content')).not.toBeNull();
  });

  test('16.4 Single <h1> per page', async ({ page }) => {
    const h1Tags = page.locator('h1');
    await expect(h1Tags).toHaveCount(1);
  });

  test('16.5 All images have alt attributes', async ({ page }) => {
    // Only check actual img elements (ignore SVGs which might use aria-labels)
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but it MUST exist
      expect(alt).not.toBeNull();
    }
  });

  test('16.6 External links have rel="noopener noreferrer"', async ({ page }) => {
    // Find all links that open in a new tab
    const externalLinks = await page.locator('a[target="_blank"]').all();
    
    for (const link of externalLinks) {
      const rel = await link.getAttribute('rel');
      // For security, external links must have these rel attributes
      expect(rel).toContain('noopener');
      expect(rel).toContain('noreferrer');
    }
  });

  test('16.7 Modals have correct ARIA attributes', async ({ page }) => {
    const videoModal = page.locator('#videoModal');
    await expect(videoModal).toHaveAttribute('role', 'dialog');
    await expect(videoModal).toHaveAttribute('aria-modal', 'true');
    await expect(videoModal).toHaveAttribute('aria-label', 'Demo Video Player');
    
    const caseStudyModal = page.locator('#caseStudyModal');
    await expect(caseStudyModal).toHaveAttribute('role', 'dialog');
    await expect(caseStudyModal).toHaveAttribute('aria-modal', 'true');
    await expect(caseStudyModal).toHaveAttribute('aria-label', 'AIAnalyzer Case Study');
  });
});
