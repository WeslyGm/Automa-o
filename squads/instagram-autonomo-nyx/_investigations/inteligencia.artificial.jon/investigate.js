const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const storagePath = path.resolve('_opensquad/_browser_profile/instagram.json');
  const context = await browser.newContext({ storageState: storagePath });
  const page = await context.newPage();

  console.log('Navigating to profile...');
  await page.goto('https://www.instagram.com/inteligencia.artificial.jon/', { waitUntil: 'networkidle' });

  // Handle pop-ups on profile
  try {
    const closeButton = await page.waitForSelector('div[role="dialog"] button svg[aria-label="Ferrar"], div[role="dialog"] button svg[aria-label="Close"], button:has-text("Not Now")', { timeout: 5000 });
    if (closeButton) {
        console.log('Closing initial pop-up...');
        await page.click('div[role="dialog"] button, button:has-text("Not Now")');
    }
  } catch (e) {}

  // Wait for the grid
  await page.waitForSelector('article a[href*="/p/"], article a[href*="/reel/"]');

  const links = await page.$$eval('article a[href*="/p/"], article a[href*="/reel/"]', anchors => {
    return anchors.slice(0, 3).map(a => a.href);
  });

  console.log(`Found ${links.length} post links.`);

  let content = '# Raw Content: @inteligencia.artificial.jon (Instagram)\n\n';
  content += `Investigated: ${new Date().toISOString().split('T')[0]}\n`;
  content += `Total contents analyzed: ${links.length}\n`;
  content += 'Content types: post/reel\n\n---\n\n';

  for (let i = 0; i < links.length; i++) {
    const url = links[i];
    console.log(`Analyzing post ${i + 1}: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000); 

    // Close any modal that appears on post page
    try {
        await page.click('button:has-text("Not Now"), [aria-label="Close"], [aria-label="Fechar"]', { timeout: 3000 });
        console.log('Closed post-page pop-up.');
    } catch (e) {}

    try {
      // Improved Caption Extraction: get the text from the first 'article' segment that contains the username
      const caption = await page.evaluate(() => {
        // Look for the main article and find the span that contains the caption
        // Instagram usually repeats the username in a link and then the span follows
        const article = document.querySelector('article');
        if (!article) return null;
        
        // Find all spans and look for one that looks like a caption (usually has a specific class or depth)
        const spans = Array.from(article.querySelectorAll('span._aade'));
        if (spans.length > 0) return spans[0].innerText;
        
        // Fallback: get all text from a section that typically holds comments/captions
        const section = article.querySelector('ul');
        return section ? section.innerText.split('\n').slice(0, 5).join('\n') : null;
      });

      const altText = await page.evaluate(() => {
        const img = document.querySelector('article img');
        return img ? img.alt : null;
      });

      content += `## Content ${i + 1}: [${url.includes('/reel/') ? 'Reel' : 'Post'}]\n\n`;
      content += `**URL:** ${url}\n\n`;
      content += `### Caption\n${caption || '[Legenda não encontrada]'}\n\n`;
      if (altText) {
        content += `### Visual Description (Alt Text)\n${altText}\n\n`;
      }
      content += '---\n\n';
      
      const screenshotPath = path.resolve(`squads/instagram-autonomo-nyx/_investigations/inteligencia.artificial.jon/screenshots/post_${i+1}_retry.png`);
      await page.screenshot({ path: screenshotPath });

    } catch (e) {
      console.error(`Error on post ${i + 1}: ${e.message}`);
    }
  }

  const outputPath = path.resolve('squads/instagram-autonomo-nyx/_investigations/inteligencia.artificial.jon/raw-content.md');
  fs.writeFileSync(outputPath, content);
  console.log(`Investigation saved to ${outputPath}`);

  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
