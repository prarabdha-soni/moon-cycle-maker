const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });

  async function snap(page, name) {
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.screenshot({ path: `/tmp/ss_${name}.png` });
    console.log(`✓ ${name}`);
  }

  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

  // 1. Welcome
  await page.goto('http://localhost:5173/welcome-mode');
  await snap(page, '01_welcome');

  // 2. Get started
  await page.locator('button:has-text("Get started")').click();
  await snap(page, '02_name_step');

  // 3. Fill name
  await page.fill('input[type="text"]', 'Priya');
  await snap(page, '03_name_filled');

  // 4. Continue → goal
  await page.locator('button:has-text("Continue")').first().click();
  await snap(page, '04_goal_step');

  // 5. Select PCOS → continue
  await page.locator('button:has-text("Manage PCOS")').click();
  await page.locator('button:has-text("Continue")').click();
  await snap(page, '05_age_step');

  // 6. Pick age → continue
  await page.locator('button:has-text("25–34")').click();
  await page.locator('button:has-text("Continue")').click();
  await snap(page, '06_period_step');

  // 7. Tap a calendar day (skip unsure) → continue
  await page.locator('button:has-text("I\'m not sure")').click();
  await snap(page, '07_cycle_step');

  // 8. Continue past cycle
  await page.locator('button:has-text("Continue")').click();
  await snap(page, '08_symptoms_step');

  // 9. Pick symptoms → continue
  await page.locator('button:has-text("Cramps")').click();
  await page.locator('button:has-text("Continue")').click();
  await snap(page, '09_allset');

  // 10. Enter SheThrives
  await page.locator('button:has-text("Enter SheThrives")').click();
  await page.waitForURL('**/', { timeout: 5000 }).catch(() => {});
  await page.waitForTimeout(600);
  await snap(page, '10_home');

  // 11. Calendar tab
  await page.locator('nav a:has-text("Calendar")').click();
  await page.waitForTimeout(500);
  await snap(page, '11_calendar');

  // 12. Log a day
  await page.locator('button:has-text("Log this day")').first().click();
  await page.waitForTimeout(400);
  await snap(page, '12_log_sheet');

  // 13. Close + Coach
  await page.locator('button:has-text("Save log")').click();
  await page.locator('nav a:has-text("Coach")').click();
  await page.waitForTimeout(500);
  await snap(page, '13_coach');

  // 14. Learn
  await page.locator('nav a:has-text("Learn")').click();
  await page.waitForTimeout(500);
  await snap(page, '14_learn');

  // 15. Open routine
  await page.locator('button:has-text("Hormone-Balancing Flow")').first().click();
  await page.waitForTimeout(400);
  await snap(page, '15_routine_detail');

  // 16. Shop
  await page.locator('button').filter({ hasText: /^✕$/ }).first().click().catch(() => {});
  await page.locator('nav a:has-text("Shop")').click();
  await page.waitForTimeout(500);
  await snap(page, '16_shop');

  // 17. Home – PCOS ring
  await page.locator('nav a').first().click();
  await page.waitForTimeout(600);
  await snap(page, '17_home_pcos_mode');

  // 18. Insights
  await page.locator('nav a:has-text("Calendar")').click();
  await page.locator('button:has-text("Insights")').click();
  await page.waitForTimeout(400);
  await snap(page, '18_insights');

  console.log('\nConsole errors:', errors.length ? errors.slice(0,5) : 'none');
  await browser.close();
  console.log('\nAll screenshots saved to /tmp/ss_*.png');
})();
