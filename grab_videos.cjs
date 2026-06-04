const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();

  await page.goto('http://localhost:5173/');
  await page.evaluate(() => {
    localStorage.setItem('petal:onboarded','1');
    localStorage.setItem('petal:name','Priya');
  });

  // Learn — regular mode (phase videos)
  await page.evaluate(() => localStorage.setItem('petal:mode','regular'));
  await page.goto('http://localhost:5173/learn');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(800);
  // scroll down to video section
  await page.evaluate(() => window.scrollBy(0, 420));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/ss_learn_videos_regular.png' });
  console.log('✓ learn videos regular');

  // Learn — PCOS mode
  await page.evaluate(() => localStorage.setItem('petal:mode','pcos'));
  await page.goto('http://localhost:5173/learn');
  await page.waitForLoadState('networkidle').catch(()=>{});
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollBy(0, 420));
  await page.waitForTimeout(400);
  await page.screenshot({ path: '/tmp/ss_learn_videos_pcos.png' });
  console.log('✓ learn videos pcos');

  // Click a video card to open player
  await page.evaluate(() => window.scrollBy(0, -420));
  await page.waitForTimeout(200);
  const videoCard = page.locator('button').filter({ hasText: 'PCOS' }).first();
  await videoCard.scrollIntoViewIfNeeded();
  await videoCard.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: '/tmp/ss_video_player.png' });
  console.log('✓ video player open');

  await browser.close();
})();
