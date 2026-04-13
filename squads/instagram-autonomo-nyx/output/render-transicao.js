const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Iniciando renderização do post de transição...');
  const browser = await chromium.launch();
  const page = await browser.newPage({ 
    viewport: { width: 1080, height: 1350 },
    deviceScaleFactor: 2 
  });
  
  const htmlPath = path.resolve(__dirname, 'post-transicao.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  
  await page.setContent(htmlContent);
  await page.waitForTimeout(3000);
  
  const canvas = await page.$('.canvas');
  if (canvas) {
    const imgPath = path.resolve(__dirname, 'post-transicao.png');
    await canvas.screenshot({ path: imgPath });
    console.log(`Render sucess: ${imgPath}`);
  } else {
    console.error('Erro: .canvas não encontrado.');
  }
  
  await browser.close();
  console.log('Renderização completa.');
})();
