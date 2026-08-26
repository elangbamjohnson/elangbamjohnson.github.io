import { test, expect } from '@playwright/test';
import { ensureLightMode, ensureMatrixMode, scrollToSection } from './helpers';

test.describe('Footer & Contact Band', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await scrollToSection(page, 'contact');
  });

  test('13.1 "Let\'s Connect" heading renders', async ({ page }) => {
    const heading = page.locator('#contact .footer-title');
    await expect(heading).toHaveText("Let's Connect");
  });

  test('13.2 "Say Hello" button has correct mailto href', async ({ page }) => {
    const sayHelloBtn = page.locator('#contact a:has-text("Say Hello")');
    await expect(sayHelloBtn).toHaveAttribute('href', 'mailto:elangbamjohnson@gmail.com');
  });

  test('13.3 & 13.4 Social buttons are visible in light mode', async ({ page }) => {
    await ensureLightMode(page);
    
    const linkedInBtn = page.locator('#contact a:has-text("LinkedIn")');
    const githubBtn = page.locator('#contact a:has-text("GitHub")');
    
    await expect(linkedInBtn).toBeVisible();
    await expect(githubBtn).toBeVisible();
  });

  test('13.5 Social buttons are visible in Matrix mode', async ({ page }) => {
    await ensureMatrixMode(page);
    
    const linkedInBtn = page.locator('#contact a:has-text("LinkedIn")');
    const githubBtn = page.locator('#contact a:has-text("GitHub")');
    
    await expect(linkedInBtn).toBeVisible();
    await expect(githubBtn).toBeVisible();
  });

  test('13.6 Social buttons have correct external hrefs', async ({ page }) => {
    const linkedInBtn = page.locator('#contact a:has-text("LinkedIn")');
    const githubBtn = page.locator('#contact a:has-text("GitHub")');
    
    await expect(linkedInBtn).toHaveAttribute('href', 'https://linkedin.com/in/elangbamjohnson');
    await expect(githubBtn).toHaveAttribute('href', 'https://github.com/elangbamjohnson');
  });

  test('13.7 Footer info line renders', async ({ page }) => {
    const footerInfo = page.locator('.footer-info');
    await expect(footerInfo).toContainText('elangbamjohnson@gmail.com');
    await expect(footerInfo).toContainText('GMT+5:30');
    await expect(footerInfo).toContainText('Imphal, India');
  });

  test('14.1 Footer bottom logo is visible', async ({ page }) => {
    const logo = page.locator('.footer-bottom .footer-logo');
    await expect(logo).toBeVisible();
    await expect(logo).toContainText('JE.');
  });

  test('14.2 Footer links are present', async ({ page }) => {
    const linksText = ['LinkedIn', 'GitHub', 'Resume'];
    for (const text of linksText) {
      const link = page.locator(`.footer-bottom .footer-links a:has-text("${text}")`);
      await expect(link).toBeVisible();
    }
  });

  test('14.3 Copyright text renders', async ({ page }) => {
    const copyright = page.locator('.footer-bottom div:last-child');
    await expect(copyright).toContainText('© 2026 Johnson Elangbam. All rights reserved.');
  });
});
