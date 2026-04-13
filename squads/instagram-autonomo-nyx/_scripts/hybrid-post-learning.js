const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const imagePath = process.argv.includes('--images') ? process.argv[process.argv.indexOf('--images') + 1] : null;
const captionFile = process.argv.includes('--file') ? process.argv[process.argv.indexOf('--file') + 1] : null;

(async () => {
    console.log('🎬 INICIANDO MODO HÍBRIDO DE APRENDIZADO...');
    console.log('Eu faço o início, você faz o final. Eu aprendo no processo.');
    console.log('--------------------------------------------------');

    if (!imagePath || !captionFile) {
        console.error('❌ Erro: Forneça --images e --file');
        process.exit(1);
    }

    const captionText = fs.readFileSync(captionFile, 'utf8');
    const authPath = 'auth-linkedin.json';
    const browser = await chromium.launch({ headless: false });
    
    let context;
    if (fs.existsSync(authPath)) {
        context = await browser.newContext({ storageState: authPath });
    } else {
        context = await browser.newContext();
    }

    const page = await context.newPage();

    // Injetar o "espião" de cliques para o final
    await page.exposeFunction('logStep', (data) => {
        console.log(`\n📍 [WESLY CLICOU EM:]`);
        console.log(`Texto: "${data.innerText}"`);
        console.log(`Seletor: ${data.selector}`);
        console.log(`---`);
    });

    await page.addInitScript(() => {
        window.addEventListener('click', (e) => {
            const el = e.target.closest('button, span, li, [role="button"]');
            if (!el) return;
            window.logStep({
                innerText: el.innerText ? el.innerText.substring(0, 50) : '',
                selector: el.className
            });
        }, true);
    });

    try {
        console.log('🔗 PASSO 1 & 2: Acessando LinkedIn...');
        await page.goto('https://www.linkedin.com/feed/');

        // Se não estiver logado, faz login manual (opcional) ou via script
        if (page.url().includes('login')) {
            console.log('🔑 Login necessário...');
            // Tentar preencher básico se tiver credenciais (usando as do memories)
            await page.fill('input[name="session_key"]', 'SEU_EMAIL_AQUI');
            await page.fill('input[name="session_password"]', 'SUA_SENHA_AQUI');
            await page.click('button[type="submit"]');
        }

        console.log('📸 PASSO 4: Abrindo modal de postagem...');
        await page.waitForSelector('.share-box-feed-entry__trigger, #ember27', { timeout: 30000 });
        await page.click('.share-box-feed-entry__trigger, #ember27');

        console.log('📁 PASSO 6: Carregando imagem...');
        await page.waitForSelector('button[aria-label="Adicionar mídia"], .share-promoted-detour-button', { timeout: 10000 });
        const [fileChooser] = await Promise.all([
            page.waitForEvent('filechooser'),
            page.click('button[aria-label="Adicionar mídia"], .share-promoted-detour-button')
        ]);
        await fileChooser.setFiles(imagePath);
        
        console.log('⏳ Aguardando processamento da imagem...');
        await page.waitForSelector('.share-box-footer__primary-btn:has-text("Avançar"), .share-box-footer__primary-btn:has-text("Next")', { timeout: 30000 });
        await page.click('.share-box-footer__primary-btn:has-text("Avançar"), .share-box-footer__primary-btn:has-text("Next")');

        console.log('✍️ PASSO 5: Escrevendo legenda...');
        await page.waitForSelector('.ql-editor');
        await page.fill('.ql-editor', captionText);

        console.log('\n🛑 PAUSA REQUERIDA: SUA VEZ, WESLY!');
        console.log('--------------------------------------------------');
        console.log('1. Selecione "Todos" na janela do LinkedIn.');
        console.log('2. Clique em "Concluído".');
        console.log('3. Clique em "Publicar".');
        console.log('Estarei aqui gravando cada movimento seu para aprender.');
        console.log('--------------------------------------------------');

        // Salvar sessão no final se o usuário fechar
        page.on('close', async () => {
            console.log('✅ Gravação concluída. Obrigado, Wesly!');
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Erro durante a automação inicial:', error.message);
    }

    // Manter o navegador aberto para o usuário
    await new Promise(() => {});
})();
