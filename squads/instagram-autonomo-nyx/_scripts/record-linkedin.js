const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('🎬 INICIANDO MODO DE APRENDIZADO...');
    console.log('Wesly, o LinkedIn vai abrir em uma janela visível.');
    console.log('Realize o post MANUALMENTE. Eu vou observar e gravar cada clique seu.');
    console.log('--------------------------------------------------');

    const authPath = 'auth-linkedin.json';
    const browser = await chromium.launch({ headless: false });
    
    let context;
    if (fs.existsSync(authPath)) {
        console.log('🔑 Carregando sessão existente...');
        context = await browser.newContext({ storageState: authPath });
    } else {
        context = await browser.newContext();
    }

    const page = await context.newPage();

    // Injetar o "espião" de cliques
    await page.exposeFunction('logStep', (data) => {
        console.log(`\n📍 [CLIQUE DETECTADO]`);
        console.log(`Elemento: ${data.tagName}`);
        console.log(`ID: ${data.id || 'Nenhum'}`);
        console.log(`Classes: ${data.classList}`);
        console.log(`Texto: "${data.innerText}"`);
        console.log(`Seletor Sugerido: ${data.selector}`);
        console.log(`---`);
    });

    await page.addInitScript(() => {
        window.addEventListener('click', (e) => {
            const el = e.target.closest('button, a, li, span, div[role="button"]');
            if (!el) return;

            // Gerar um seletor simples
            let selector = el.tagName.toLowerCase();
            if (el.id) selector += `#${el.id}`;
            if (el.className && typeof el.className === 'string') {
                selector += `.${el.className.split(' ').join('.')}`;
            }

            window.logStep({
                tagName: el.tagName,
                id: el.id,
                classList: el.className,
                innerText: el.innerText ? el.innerText.substring(0, 50) : '',
                selector: selector
            });
        }, true);
    });

    await page.goto('https://www.linkedin.com/feed/');

    console.log('🚀 Pronto! Pode começar a postar. Vou ficar aqui gravando...');

    // Esperar o usuário fechar o navegador
    page.on('close', () => {
        console.log('\n✅ Gravação finalizada. Analisando os passos...');
        process.exit(0);
    });

    // Manter o processo vivo
    await new Promise(() => {});
})();
