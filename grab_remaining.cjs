const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  // Pre-set onboarded state so we skip onboarding
  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('petal:onboarded', '1');
    localStorage.setItem('petal:mode', 'regular');
    localStorage.setItem('petal:name', 'Priya');
  });

  // Shop
  await page.goto('http://localhost:5173/shop');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/ss_16_shop.png' });
  console.log('✓ shop');

  // Home – regular mode
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/ss_17_home_regular.png' });
  console.log('✓ home regular');

  // Insights
  await page.goto('http://localhost:5173/calendar');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.locator('button:has-text("Insights")').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/ss_18_insights.png' });
  console.log('✓ insights');

  // Conceive mode home
  await page.evaluate(() => localStorage.setItem('petal:mode','conceive'));
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/ss_19_home_conceive.png' });
  console.log('✓ home conceive');

  await browser.close();
})();
