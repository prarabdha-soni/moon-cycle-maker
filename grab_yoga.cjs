const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ headless: true });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('petal:onboarded','1');
    localStorage.setItem('petal:name','Priya');
    localStorage.setItem('petal:mode','pcos');
  });
  await page.reload();
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(800);

  // Scroll to yoga section
  await page.locator('h3:has-text("Today\'s yoga")').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/ss_yoga_section.png' });
  console.log('✓ yoga section (PCOS)');

  // Start sequence
  await page.locator('button:has-text("Start sequence")').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/ss_yoga_player.png' });
  console.log('✓ yoga player');

  // Pause then next
  await page.locator('button:has-text("⏸")').click();
  await page.waitForTimeout(200);
  await page.screenshot({ path: '/tmp/ss_yoga_paused.png' });
  console.log('✓ yoga paused');

  // Regular mode
  await page.locator('button:has-text("✕")').click();
  await page.waitForTimeout(300);
  await page.evaluate(() => localStorage.setItem('petal:mode','regular'));
  await page.reload();
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(800);
  await page.locator('h3:has-text("Today\'s yoga")').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: '/tmp/ss_yoga_regular.png' });
  console.log('✓ yoga section (regular)');

  await b.close();
})();
