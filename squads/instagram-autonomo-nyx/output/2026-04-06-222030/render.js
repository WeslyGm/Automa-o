const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Iniciando renderização...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  
  const htmlPath = path.resolve(__dirname, 'carrossel-light-mode.html');
  await page.goto(`file://${htmlPath}`);
  
  // Aguarda fontes carregarem
  await page.waitForTimeout(1000);
  
  const slides = await page.$$('.slide');
  console.log(`Encontrados ${slides.length} slides.`);
  
  for (let i = 0; i < slides.length; i++) {
    const imgPath = path.resolve(__dirname, `slide-${i + 1}.png`);
    await slides[i].screenshot({ path: imgPath });
    console.log(`Screenshot salvo: ${imgPath}`);
  }
  
  await browser.close();
  console.log('Renderização completa.');
})();
