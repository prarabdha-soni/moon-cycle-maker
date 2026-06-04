const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('petal:onboarded','1');
    localStorage.setItem('petal:name','Priya');
    localStorage.setItem('petal:mode','pcos');
  });

  await page.goto('http://localhost:5173/learn');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(1000);

  // Find the video section heading and scroll to it
  const heading = page.locator('h3').filter({ hasText: 'Videos for PCOS' });
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/ss_video_section.png' });
  console.log('✓ video section');

  // click first video card
  const firstVideoBtn = page.locator('button').filter({ hasText: '25-Min Yoga for PCOS' }).first();
  await firstVideoBtn.click();
  await page.waitForTimeout(800);
  await page.screenshot({ path: '/tmp/ss_video_player2.png' });
  console.log('✓ video player');

  await browser.close();
})();
