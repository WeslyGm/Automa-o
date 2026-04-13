const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    console.log('🚀 Abrindo LinkedIn para salvar sessão...');
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.linkedin.com/feed/', { timeout: 60000 });

    console.log('✅ Aguardando você confirmar o login no navegador...');
    console.log('Dica: Assim que a página inicial carregar, o script salvará o acesso automaticamente.');

    try {
        // Espera até que a URL seja a do feed oficial
        await page.waitForURL('https://www.linkedin.com/feed/**', { timeout: 120000 });
        await page.waitForTimeout(5000); // Garantia de carregamento
        
        await context.storageState({ path: 'auth-linkedin.json' });
        console.log('🎉 SUCESSO: Arquivo auth-linkedin.json criado!');
    } catch (e) {
        console.log('❌ O tempo acabou antes de detectar o login.');
    } finally {
        await browser.close();
    }
})();
