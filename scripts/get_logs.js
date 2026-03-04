const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Capture console logs
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

    await page.goto('http://localhost:3000/music/master', { waitUntil: 'networkidle0' });

    // Need to log in if there's a password, but assuming dev skips it or we can just
    // We can't easily click through Master panel without knowing the DOM, but let's see.

    await browser.close();
})();
