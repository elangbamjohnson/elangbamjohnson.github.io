import { test, expect } from '@playwright/test';
import { scrollToSection } from './helpers';

test.describe('Projects Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'projects');
  });

  test('6.1 Projects section heading is visible', async ({ page }) => {
    const heading = page.locator('#projects .section-header h2');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("What I've been building.");
  });

  test('6.2 All 7 project cards are rendered', async ({ page }) => {
    const projectCards = page.locator('.bento-item');
    await expect(projectCards).toHaveCount(7);
  });

  test('6.3 Project cards have GitHub links', async ({ page }) => {
    // Check the first project card (AIAnalyzer) has a GitHub link
    const firstProjectGithub = page.locator('.bento-item').first().locator('a.btn-action:has-text("GitHub")');
    await expect(firstProjectGithub).toBeVisible();
    await expect(firstProjectGithub).toHaveAttribute('href', /github\.com/);
  });

  test('6.4 Project cards have tech stack tags', async ({ page }) => {
    const firstProjectTags = page.locator('.bento-item').first().locator('.card-tags .tag-pill');
    const tagCount = await firstProjectTags.count();
    expect(tagCount).toBeGreaterThan(0);
  });

  test('6.5 "View all projects" link is visible', async ({ page }) => {
    const viewAllLink = page.locator('#projects .view-all-btn');
    await expect(viewAllLink).toBeVisible();
    await expect(viewAllLink).toContainText('View all on GitHub');
    await expect(viewAllLink).toHaveAttribute('href', 'https://github.com/elangbamjohnson');
  });

  test('6.6 & 6.7 AIAnalyzer (featured) has action buttons', async ({ page }) => {
    // The first card should be the AIAnalyzer, which has the "Watch Demo" and "Case Study" buttons
    const featuredCard = page.locator('.bento-item').first();
    await expect(featuredCard).toBeVisible();

    const watchDemoBtn = featuredCard.locator('button:has-text("Watch Demo")');
    const caseStudyBtn = featuredCard.locator('button:has-text("Case Study")');

    await expect(watchDemoBtn).toBeVisible();
    await expect(caseStudyBtn).toBeVisible();
  });
});
