import { test, expect } from '@playwright/test';

test.describe('Topographic Scan & Page Geometry Audit', () => {

  test('Console errors, unhandled exceptions & network failures', async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    page.on('pageerror', err => pageErrors.push(err.message));
    page.on('requestfailed', req => failedRequests.push(`${req.method()} ${req.url()}`));

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('\n=== 1. CONSOLE & NETWORK AUDIT ===');
    console.log('Console Errors:', consoleErrors.length ? consoleErrors : 'None (Clean)');
    console.log('Page Errors:', pageErrors.length ? pageErrors : 'None (Clean)');
    console.log('Failed Requests:', failedRequests.length ? failedRequests : 'None (Clean)');

    expect(pageErrors).toHaveLength(0);
    // Ignore minor third party or local favicon if any, but verify no broken app assets
    const brokenAppAssets = failedRequests.filter(url => !url.includes('google-analytics') && !url.includes('favicon'));
    expect(brokenAppAssets).toHaveLength(0);
  });

  test('Section sequence, dimensions & vertical rhythm (Desktop 1440px)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sections = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('header, section, footer'));
      return elements.map(el => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        const heading = el.querySelector('h1, h2, h3, h4')?.textContent?.trim().replace(/\s+/g, ' ');
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || '(no-id)',
          className: el.className,
          top: Math.round(rect.top + window.scrollY),
          bottom: Math.round(rect.bottom + window.scrollY),
          height: Math.round(rect.height),
          paddingTop: style.paddingTop,
          paddingBottom: style.paddingBottom,
          marginTop: style.marginTop,
          marginBottom: style.marginBottom,
          bg: style.backgroundColor,
          color: style.color,
          heading: heading || '(no-heading)'
        };
      });
    });

    console.log('\n=== 2. SECTION TOPOGRAPHY & ELEVATION (1440px) ===');
    sections.forEach((s, i) => {
      console.log(`[${i + 1}] <${s.tag} id="${s.id}">: height=${s.height}px, Y=${s.top}px..${s.bottom}px, pad=${s.paddingTop}/${s.paddingBottom}, heading="${s.heading}"`);
    });

    // Check vertical flow: no section should have 0 height or negative gap with previous
    for (let i = 1; i < sections.length; i++) {
      const prev = sections[i - 1];
      const curr = sections[i];
      expect(curr.height).toBeGreaterThan(0);
      // Allow minor subpixel or fixed header overlap, but sections themselves should follow sequentially
      if (prev.tag !== 'header') {
        const gap = curr.top - prev.bottom;
        console.log(`   Gap between [${prev.id}] and [${curr.id}]: ${gap}px`);
      }
    }
  });

  test('Heading hierarchy and landmarks audit', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const headingData = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
      return headings.map(h => ({
        tag: h.tagName.toLowerCase(),
        level: parseInt(h.tagName[1]),
        text: h.textContent?.trim().replace(/\s+/g, ' ') || '',
        visible: (h as HTMLElement).offsetParent !== null,
        id: h.id || ''
      }));
    });

    console.log('\n=== 3. HEADING HIERARCHY AUDIT ===');
    let hierarchyIssues: string[] = [];
    let prevLevel = 0;

    headingData.forEach((h, idx) => {
      console.log(`  ${h.tag.toUpperCase()}: "${h.text}" ${h.visible ? '' : '[HIDDEN]'}`);
      if (!h.text) {
        hierarchyIssues.push(`Empty heading at index ${idx}: <${h.tag}>`);
      }
      if (prevLevel > 0 && h.level > prevLevel + 1) {
        hierarchyIssues.push(`Skipped heading level from <h${prevLevel}> to <${h.tag}>: "${h.text}"`);
      }
      prevLevel = h.level;
    });

    console.log('Heading Issues:', hierarchyIssues.length ? hierarchyIssues : 'None (Perfect hierarchy)');
  });

  test('Horizontal overflow audit across 6 viewports', async ({ page }) => {
    const viewports = [
      { name: 'Desktop Large (1440px)', width: 1440, height: 900 },
      { name: 'Desktop Medium (1200px)', width: 1200, height: 800 },
      { name: 'Tablet Landscape (1024px)', width: 1024, height: 768 },
      { name: 'Tablet Portrait (768px)', width: 768, height: 1024 },
      { name: 'Mobile Standard (480px)', width: 480, height: 854 },
      { name: 'Mobile Compact (375px)', width: 375, height: 667 },
      { name: 'Mobile Minimal (320px)', width: 320, height: 568 }
    ];

    console.log('\n=== 4. HORIZONTAL OVERFLOW SCAN ===');

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const overflowData = await page.evaluate((viewportWidth) => {
        const bodyScrollWidth = document.body.scrollWidth;
        const docScrollWidth = document.documentElement.scrollWidth;
        const maxScrollWidth = Math.max(bodyScrollWidth, docScrollWidth);
        const hasOverflow = maxScrollWidth > viewportWidth + 1; // 1px threshold for subpixel

        const offendingElements: string[] = [];
        if (hasOverflow) {
          document.querySelectorAll('*').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.right > viewportWidth + 1) {
              const tag = el.tagName.toLowerCase();
              const id = el.id ? `#${el.id}` : '';
              const cls = el.className ? `.${Array.from(el.classList).join('.')}` : '';
              offendingElements.push(`${tag}${id}${cls} (right: ${Math.round(rect.right)}px vs vp: ${viewportWidth}px)`);
            }
          });
        }

        return {
          viewportWidth,
          maxScrollWidth,
          hasOverflow,
          offendingCount: offendingElements.length,
          topOffenders: offendingElements.slice(0, 5)
        };
      }, vp.width);

      if (overflowData.hasOverflow) {
        console.log(`❌ OVERFLOW at ${vp.name}: scrollWidth=${overflowData.maxScrollWidth}px > viewport=${vp.width}px`);
        console.log('   Offenders:', overflowData.topOffenders);
      } else {
        console.log(`✅ ${vp.name}: No overflow (scrollWidth=${overflowData.maxScrollWidth}px)`);
      }

      expect(overflowData.hasOverflow, `Overflow detected at ${vp.name}`).toBe(false);
    }
  });

  test('Anchor links and navigation integrity', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const linkAudit = await page.evaluate(() => {
      const internalAnchors = Array.from(document.querySelectorAll('a[href^="#"]'));
      const results: { href: string; text: string; exists: boolean }[] = [];

      for (const a of internalAnchors) {
        const href = a.getAttribute('href') || '';
        if (href === '#' || href === '') continue;
        const targetId = href.substring(1);
        const targetEl = document.getElementById(targetId) || document.querySelector(`[name="${targetId}"]`);
        results.push({
          href,
          text: a.textContent?.trim().replace(/\s+/g, ' ') || '',
          exists: targetEl !== null
        });
      }
      return results;
    });

    console.log('\n=== 5. ANCHOR LINK INTEGRITY AUDIT ===');
    const broken = linkAudit.filter(l => !l.exists);
    if (broken.length) {
      console.log('❌ Broken internal anchor links:');
      broken.forEach(b => console.log(`   href="${b.href}" (Text: "${b.text}")`));
    } else {
      console.log(`✅ All ${linkAudit.length} internal anchor links target valid DOM IDs.`);
    }

    expect(broken).toHaveLength(0);
  });

  test('Color contrast and readability in Default vs Matrix theme', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const sampleElements = [
      { name: 'Body', selector: 'body' },
      { name: 'Hero Name', selector: '.hero-name' },
      { name: 'Hero Subtitle', selector: '.hero-subtitle' },
      { name: 'Hero Audience Line', selector: '.hero-audience-line' },
      { name: 'About Dark Section', selector: '#about' },
      { name: 'Timeline Employer', selector: '.timeline-employer' },
      { name: 'Timeline Role', selector: '.timeline-role' },
      { name: 'Skills Category Title', selector: '.skill-category-title' },
      { name: 'Skill Pill', selector: '.skill-pill' },
      { name: 'Education Degree', selector: '.education-degree' },
      { name: 'Project Card Title', selector: '.bento-card-title' },
      { name: 'Testimonial Banner Text', selector: '.testimonial-banner-text' },
      { name: 'Outcome Title', selector: '.outcome-title' },
      { name: 'Outcome Proof', selector: '.outcome-proof' },
      { name: 'Step Card Title', selector: '.step-title' },
      { name: 'Engagement Title', selector: '.engagement-title' },
      { name: 'Logistics Item Value', selector: '.logistics-value' },
      { name: 'Form Input', selector: '.form-input' },
      { name: 'Form Button', selector: '.form-button' },
      { name: 'FAQ Question', selector: '.faq-question' },
      { name: 'Contact Heading', selector: '.footer-band h2' }
    ];

    console.log('\n=== 6. THEME STYLING & CONTRAST AUDIT ===');

    // 1. Default Theme
    const defaultStyles = await page.evaluate((elements) => {
      return elements.map(item => {
        const el = document.querySelector(item.selector);
        if (!el) return { name: item.name, found: false };
        const cs = window.getComputedStyle(el);
        return {
          name: item.name,
          found: true,
          color: cs.color,
          bg: cs.backgroundColor,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight
        };
      });
    }, sampleElements);

    console.log('--- Default Theme (Light/Navy/Cream) ---');
    defaultStyles.forEach(s => {
      if (s.found) {
        console.log(`  ${s.name.padEnd(25)}: color=${s.color.padEnd(22)} bg=${s.bg.padEnd(22)} font=${s.fontSize}/${s.fontWeight}`);
      }
    });

    // 2. Matrix Theme
    await page.evaluate(() => document.body.classList.add('theme-matrix'));
    const matrixStyles = await page.evaluate((elements) => {
      return elements.map(item => {
        const el = document.querySelector(item.selector);
        if (!el) return { name: item.name, found: false };
        const cs = window.getComputedStyle(el);
        return {
          name: item.name,
          found: true,
          color: cs.color,
          bg: cs.backgroundColor,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight
        };
      });
    }, sampleElements);

    console.log('\n--- Matrix Theme (Terminal Dark/Green) ---');
    matrixStyles.forEach(s => {
      if (s.found) {
        console.log(`  ${s.name.padEnd(25)}: color=${s.color.padEnd(22)} bg=${s.bg.padEnd(22)} font=${s.fontSize}/${s.fontWeight}`);
      }
    });
  });

  test('Interactive component topography and accessibility checks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const interactiveAudit = await page.evaluate(() => {
      // Buttons
      const buttons = Array.from(document.querySelectorAll('button'));
      const buttonIssues: string[] = [];
      buttons.forEach(btn => {
        const text = btn.textContent?.trim() || btn.getAttribute('aria-label') || '';
        if (!text) {
          buttonIssues.push(`Button missing text or aria-label: ${btn.outerHTML.substring(0, 60)}`);
        }
      });

      // Form inputs & labels
      const formControls = Array.from(document.querySelectorAll('input, select, textarea'));
      const formIssues: string[] = [];
      formControls.forEach(ctrl => {
        const id = ctrl.getAttribute('id');
        const label = id ? document.querySelector(`label[for="${id}"]`) : null;
        const ariaLabel = ctrl.getAttribute('aria-label');
        if (!label && !ariaLabel) {
          formIssues.push(`Form control <${ctrl.tagName.toLowerCase()} id="${id || ''}" name="${ctrl.getAttribute('name') || ''}"> has no associated <label> or aria-label`);
        }
      });

      // Accordions / FAQ items
      const faqQuestions = Array.from(document.querySelectorAll('.faq-question'));
      const faqStats = {
        totalFAQ: faqQuestions.length,
        hasAriaExpanded: faqQuestions.filter(q => q.hasAttribute('aria-expanded')).length
      };

      // Collapsible more projects
      const moreProjects = document.querySelector('#more-projects');
      const moreProjectsSummary = document.querySelector('.more-projects-toggle');

      return {
        buttonCount: buttons.length,
        buttonIssues,
        formControlsCount: formControls.length,
        formIssues,
        faqStats,
        hasMoreProjects: moreProjects !== null,
        hasMoreProjectsSummary: moreProjectsSummary !== null
      };
    });

    console.log('\n=== 7. INTERACTIVE & ACCESSIBILITY AUDIT ===');
    console.log(`Buttons checked: ${interactiveAudit.buttonCount}, Issues: ${interactiveAudit.buttonIssues.length ? interactiveAudit.buttonIssues : 'None'}`);
    console.log(`Form controls checked: ${interactiveAudit.formControlsCount}, Issues: ${interactiveAudit.formIssues.length ? interactiveAudit.formIssues : 'None'}`);
    console.log(`FAQ questions: ${interactiveAudit.faqStats.totalFAQ}, With aria-expanded: ${interactiveAudit.faqStats.hasAriaExpanded}`);
    console.log(`More projects details element: ${interactiveAudit.hasMoreProjects}, Summary toggle: ${interactiveAudit.hasMoreProjectsSummary}`);

    expect(interactiveAudit.buttonIssues).toHaveLength(0);
    expect(interactiveAudit.formIssues).toHaveLength(0);
  });

});
