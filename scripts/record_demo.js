const puppeteer = require('puppeteer');
const { PuppeteerScreenRecorder } = require('puppeteer-screen-recorder');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  console.log("Starting Puppeteer...");
  const browser = await puppeteer.launch({
    headless: "new",
    defaultViewport: { width: 1920, height: 1080 },
    args: ['--window-size=1920,1080']
  });
  
  const page = await browser.newPage();
  
  const recorder = new PuppeteerScreenRecorder(page, {
    fps: 30,
    videoFrame: { width: 1920, height: 1080 },
    recordDurationLimit: 120 // Max 2 minutes
  });

  console.log("Starting recording...");
  await recorder.start('./demo_v2.mp4');
  
  const typeSlow = async (selector, text) => {
    await page.waitForSelector(selector);
    await page.type(selector, text, { delay: 50 });
  };
  
  try {
    // 1. Entrepreneur Flow
    console.log("Entrepreneur Flow...");
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await delay(2000);
    
    // Login
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle2' });
    await delay(1000);
    await typeSlow('input[type="email"]', 'amara@greenweave.example');
    await typeSlow('input[type="password"]', 'Test1234@@');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await delay(3000);
    
    // Navigate Products
    await page.goto('http://localhost:3000/portal/entrepreneur/products', { waitUntil: 'networkidle2' });
    await delay(3000);
    
    // Navigate Grants
    await page.goto('http://localhost:3000/portal/entrepreneur/grants', { waitUntil: 'networkidle2' });
    await delay(3000);
    
    // Sign out
    await page.goto('http://localhost:3000/api/auth/signout', { waitUntil: 'networkidle2' });
    await delay(1000);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await delay(2000);
    
    // 2. Funder Flow
    console.log("Funder Flow...");
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle2' });
    await delay(1000);
    await typeSlow('input[type="email"]', 'fund@mosaic.example');
    await typeSlow('input[type="password"]', 'Test1234@@');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await delay(3000);
    
    // Pipeline / Shortlist
    await page.goto('http://localhost:3000/portal/funder/pipeline', { waitUntil: 'networkidle2' });
    await delay(4000);
    
    // Sign out
    await page.goto('http://localhost:3000/api/auth/signout', { waitUntil: 'networkidle2' });
    await delay(1000);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await delay(2000);

    // 3. Corporate Flow
    console.log("Corporate Flow...");
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle2' });
    await delay(1000);
    await typeSlow('input[type="email"]', 'procurement@allied.example');
    await typeSlow('input[type="password"]', 'Test1234@@');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await delay(3000);
    
    // Sign out
    await page.goto('http://localhost:3000/api/auth/signout', { waitUntil: 'networkidle2' });
    await delay(1000);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await delay(2000);

    // 4. Admin Flow
    console.log("Admin Flow...");
    await page.goto('http://localhost:3000/auth/sign-in', { waitUntil: 'networkidle2' });
    await delay(1000);
    await typeSlow('input[type="email"]', 'admin@bhaf.example');
    await typeSlow('input[type="password"]', 'Test1234@@');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
      page.click('button[type="submit"]')
    ]);
    await delay(3000);
    
    // Users
    await page.goto('http://localhost:3000/admin/profiles', { waitUntil: 'networkidle2' });
    await delay(3000);
    
    // Settings
    await page.goto('http://localhost:3000/admin/settings', { waitUntil: 'networkidle2' });
    await delay(4000);

  } catch (error) {
    console.error("Error during recording:", error);
  } finally {
    console.log("Stopping recording...");
    await recorder.stop();
    await browser.close();
    console.log("Done! Video saved to demo_v2.mp4");
  }
})();
