import { test, expect } from '@playwright/test';

test.describe('17. Cross-Theme Visual Consistency', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  const getComputedStyleValue = async (page: any, selector: string, property: string) => {
    return await page.evaluate(({sel, prop}) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      return window.getComputedStyle(el).getPropertyValue(prop);
    }, { sel: selector, prop: property });
  };

  test('17.1, 17.2 & 17.4 Text and Nav links are readable in both themes', async ({ page }) => {
    // Light Mode (default)
    let bodyBg = await getComputedStyleValue(page, 'body', 'background-color');
    let textColor = await getComputedStyleValue(page, 'h1.hero-title', 'color');
    let navColor = await getComputedStyleValue(page, '.nav-links a', 'color');
    
    // Validate they are not the same (basic readability check)
    expect(bodyBg).not.toEqual(textColor);
    expect(bodyBg).not.toEqual(navColor);

    // Switch to Matrix Mode
    await page.locator('#theme-toggle').click();
    await expect(page.locator('html')).toHaveClass(/theme-matrix/);

    // Matrix Mode
    bodyBg = await getComputedStyleValue(page, 'body', 'background-color');
    textColor = await getComputedStyleValue(page, 'h1.hero-title', 'color');
    navColor = await getComputedStyleValue(page, '.nav-links a', 'color');
    
    expect(bodyBg).not.toEqual(textColor);
    expect(bodyBg).not.toEqual(navColor);
  });

  test('17.3 Buttons are visible in both themes', async ({ page }) => {
    // Light Mode
    let btnBg = await getComputedStyleValue(page, '.btn-primary', 'background-color');
    let bodyBg = await getComputedStyleValue(page, 'body', 'background-color');
    expect(btnBg).not.toEqual(bodyBg);

    // Switch to Matrix Mode
    await page.locator('#theme-toggle').click();
    
    // Matrix Mode
    btnBg = await getComputedStyleValue(page, '.btn-primary', 'background-color');
    bodyBg = await getComputedStyleValue(page, 'body', 'background-color');
    expect(btnBg).not.toEqual(bodyBg);
  });

  test('17.5 Dark section text readable in both themes', async ({ page }) => {
    // Light Mode
    let darkSectionBg = await getComputedStyleValue(page, '.dark-section', 'background-color');
    let darkSectionText = await getComputedStyleValue(page, '.dark-section h2', 'color');
    expect(darkSectionBg).not.toEqual(darkSectionText);

    // Switch to Matrix Mode
    await page.locator('#theme-toggle').click();
    
    // Matrix Mode
    darkSectionBg = await getComputedStyleValue(page, '.dark-section', 'background-color');
    darkSectionText = await getComputedStyleValue(page, '.dark-section h2', 'color');
    expect(darkSectionBg).not.toEqual(darkSectionText);
  });
});
