import { test } from '@playwright/test';

test.describe('Feature Screenshots', () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.setTimeout(120_000);

  const clip = { x: 0, y: 0, width: 390, height: 844 };

  async function prep(page: import('@playwright/test').Page, colorScheme: 'light' | 'dark') {
    await page.emulateMedia({ colorScheme });
    // Navigate to app first so localStorage is accessible
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Dismiss onboarding
    await page.evaluate(() => localStorage.setItem('grasswise-onboarding-done', 'true'));
    // Reload so the setting takes effect
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  }

  async function go(page: import('@playwright/test').Page, path: string) {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(800);
  }

  async function applyThemeClass(page: import('@playwright/test').Page, mode: 'light' | 'dark') {
    if (mode === 'dark') {
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.style.colorScheme = 'dark';
      });
    } else {
      await page.evaluate(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.style.colorScheme = 'light';
      });
    }
    await page.waitForTimeout(500);
  }

  async function snap(page: import('@playwright/test').Page, name: string) {
    await page.screenshot({ path: `screenshots/${name}`, clip });
  }

  async function scrollTo(page: import('@playwright/test').Page, text: string) {
    const loc = page.locator(`text=${text}`).first();
    await loc.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }

  async function safeScrollTo(page: import('@playwright/test').Page, texts: string[], fallbackPx: number) {
    for (const text of texts) {
      const loc = page.locator(`text=${text}`).first();
      if (await loc.isVisible({ timeout: 2000 }).catch(() => false)) {
        await loc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        return;
      }
    }
    // Fallback: scroll by pixels
    await page.evaluate((px) => window.scrollBy(0, px), fallbackPx);
    await page.waitForTimeout(500);
  }

  // ── Light Mode ──────────────────────────────────────────────
  test('capture light mode screenshots', async ({ page }) => {
    await prep(page, 'light');

    // 1. Dashboard
    await go(page, '/');
    await applyThemeClass(page, 'light');
    await snap(page, 'dashboard-light.png');

    // 2. Tools
    await go(page, '/tools');
    await applyThemeClass(page, 'light');
    await snap(page, 'tools-light.png');

    // 3. Soil Plan
    await go(page, '/plan');
    await applyThemeClass(page, 'light');
    await snap(page, 'soil-plan-light.png');

    // 4. Pest Identifier
    await go(page, '/pest-identifier');
    await applyThemeClass(page, 'light');
    await snap(page, 'pest-identifier-light.png');

    // 5. Tutorials
    await go(page, '/tutorials');
    await applyThemeClass(page, 'light');
    await snap(page, 'tutorials-light.png');

    // 6. Journal
    await go(page, '/journal');
    await applyThemeClass(page, 'light');
    await snap(page, 'journal-light.png');

    // 7. Achievements
    await go(page, '/achievements');
    await applyThemeClass(page, 'light');
    await snap(page, 'achievements-light.png');

    // 8. Weather alerts — scroll to WeatherCard on dashboard
    await go(page, '/');
    await applyThemeClass(page, 'light');
    await safeScrollTo(page, ['Weather', 'Forecast', 'weather'], 600);
    await snap(page, 'weather-alerts-light.png');

    // 9. Cost Tracker — scroll to it on Tools page
    await go(page, '/tools');
    await applyThemeClass(page, 'light');
    await safeScrollTo(page, ['Add Expense', 'Spending Summary', 'Cost'], 2000);
    await snap(page, 'cost-tracker-light.png');

    // 10. Monthly Checklist
    await go(page, '/tools');
    await applyThemeClass(page, 'light');
    await safeScrollTo(page, ['Monthly Checklist'], 400);
    await snap(page, 'monthly-checklist-light.png');

    // 11. Mowing Height Guide
    await go(page, '/tools');
    await applyThemeClass(page, 'light');
    await safeScrollTo(page, ['Mowing Height Guide', 'Mowing Height'], 1200);
    await snap(page, 'mowing-guide-light.png');

    // 12. Charts section
    await go(page, '/tools');
    await applyThemeClass(page, 'light');
    await safeScrollTo(page, ['Activity Trends', 'Weather Forecast', 'Monthly Spending'], 3000);
    await snap(page, 'charts-light.png');
  });

  // ── Dark Mode ───────────────────────────────────────────────
  test('capture dark mode screenshots', async ({ page }) => {
    await prep(page, 'dark');

    // 13. Dashboard dark
    await go(page, '/');
    await applyThemeClass(page, 'dark');
    await snap(page, 'dashboard-dark.png');

    // 14. Tools dark
    await go(page, '/tools');
    await applyThemeClass(page, 'dark');
    await snap(page, 'tools-dark.png');

    // 15. Soil Plan dark
    await go(page, '/plan');
    await applyThemeClass(page, 'dark');
    await snap(page, 'soil-plan-dark.png');

    // 16. Pest Identifier dark
    await go(page, '/pest-identifier');
    await applyThemeClass(page, 'dark');
    await snap(page, 'pest-identifier-dark.png');
  });
});
