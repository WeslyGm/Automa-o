const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  context.setDefaultTimeout(0); // Nunca dar timeout global
  const page = await context.newPage();
  page.setDefaultTimeout(0);

  await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle' });
  
  console.log("⚠️  PREENCHENDO CREDENCIAIS AUTOMATICAMENTE...");

  try {
    await page.waitForSelector('input[name="username"]', { timeout: 15000 });
    await page.fill('input[name="username"]', 'SEU_USUARIO_AQUI');
    await page.fill('input[name="password"]', 'SUA_SENHA_AQUI');
    await page.click('button[type="submit"]');
    console.log("✅ Cliquei em entrar. Aguardando a página principal...");
  } catch(e) {
    console.log("⚠️ A tela de login demorou a aparecer, verifique o navegador.");
  }

  // Espera a barra lateral com botão Criar/Create aparecer (sinal de login completo)
  await page.waitForFunction(() => {
    const els = document.querySelectorAll('span, svg, div');
    return Array.from(els).some(el => {
      const text = el.textContent ? el.textContent.trim() : '';
      const aria = el.getAttribute('aria-label') || '';
      return text === 'Criar' || text === 'Create' || aria === 'Criar' || aria === 'Create' || text === 'Search';
    });
  }, { timeout: 0 });

  // Dá um tempo extra pra cookies persistirem
  await page.waitForTimeout(3000);

  // Salva o estado da sessão
  await context.storageState({ path: 'auth.json' });
  console.log("✅ Login salvo em auth.json com sucesso! Pode fechar o navegador.");
  
  await browser.close();
})();
