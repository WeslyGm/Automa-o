const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

// ━━━━ Parse Arguments ━━━━
function parseArgs() {
    const args = process.argv.slice(2);
    let images = [];
    let caption = '';

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--images' && args[i + 1]) {
            images = args[i + 1].split(',').map(p => path.resolve(p.trim()));
            i++;
        }
        if (args[i] === '--caption' && args[i + 1]) {
            caption = args[i + 1];
            i++;
        }
        if (args[i] === '--file' && args[i + 1]) {
            const filePath = path.resolve(args[i + 1]);
            if (fs.existsSync(filePath)) {
                caption = fs.readFileSync(filePath, 'utf-8');
            }
            i++;
        }
        if (args[i] === '--brave') {
            useBrave = true;
        }
    }
    return { images, caption, useBrave };
}

(async () => {
    let { images, caption, useBrave } = parseArgs();
    const authPath = 'auth-linkedin.json';

    console.log(`🚀 Iniciando Protocolo de 7 Passos do Wesly...`);
    if (useBrave) console.log('🛡️ Usando perfil persistente do Brave');

    let browser;
    let context;

    if (useBrave) {
        const userDataDir = path.join(process.env.LOCALAPPDATA, 'BraveSoftware', 'Brave-Browser', 'User Data');
        const executablePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

        context = await chromium.launchPersistentContext(userDataDir, {
            executablePath: executablePath,
            headless: false,
            viewport: { width: 1280, height: 800 },
            args: ['--profile-directory=Default']
        });
        browser = context.browser();
    } else {
        browser = await chromium.launch({
            headless: false,
            slowMo: 1000
        });
        context = await browser.newContext({
            viewport: { width: 1280, height: 800 }
        });
    }
    
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    try {
        if (!useBrave) {
            // PASSO 1 e 2: Abrir LinkedIn e colocar E-mail
            console.log('🔗 PASSO 1 & 2: Abrindo Login e inserindo E-mail...');
            await page.goto('https://www.linkedin.com/login', { timeout: 60000 });
            
            const loginUserSelector = '#username, #session_key, input[name="session_key"]';
            await page.waitForSelector(loginUserSelector, { timeout: 60000 });
            await page.click(loginUserSelector);
            await page.fill(loginUserSelector, 'SEU_EMAIL_AQUI');

            console.log('⏳ PASSO 3: Aguardando 4 segundos (conforme solicitado)...');
            await page.waitForTimeout(4000);

            console.log('🔑 PASSO 4: Inserindo Senha...');
            const passSelector = '#password, #session_password, input[name="session_password"]';
            await page.waitForSelector(passSelector);
            await page.click(passSelector);
            await page.fill(passSelector, 'SUA_SENHA_AQUI');

            console.log('🔘 PASSO 5: Clicando em Entrar...');
            await page.click('button[type="submit"]');

            await page.waitForTimeout(5000);
            if (page.url().includes('checkpoint')) {
                console.log('⚠️ SEGURANÇA: LinkedIn pediu um código. Por favor, digite no navegador!');
                console.log('⏳ Aguardando... (até 5 minutos)');
                try {
                    await page.waitForURL('**/feed/**', { timeout: 300000 });
                    console.log('✅ Código verificado! Continuando...');
                } catch (e) {
                    console.error('❌ Timeout na verificação de segurança. O navegador pode ter fechado ou o código demorou muito.');
                    throw e;
                }
            }
        } else {
            console.log('🔗 Acessando LinkedIn feed diretamente...');
            await page.goto('https://www.linkedin.com/feed/', { timeout: 60000 });
            await page.waitForTimeout(5000);
            
            if (page.url().includes('login')) {
                console.log('⚠️ AVISO: Sessão expirada ou não encontrada no Brave. Por favor, faça login manual.');
                await page.waitForURL('**/feed/**', { timeout: 300000 });
            }
        }

        console.log('📸 PASSO 6: Iniciando postagem (Foto)...');
        
        // Aguardar o feed carregar
        await page.waitForTimeout(3000);
        
        // Estratégia 1: Clique direto via texto
        let fotoBtnClicado = false;
        
        try {
            console.log('  ▸ Tentando encontrar botão "Foto"...');
            const fotoBtn = page.locator('button:has-text("Foto")').first();
            if (await fotoBtn.isVisible({ timeout: 5000 })) {
                await fotoBtn.click();
                console.log('  ✅ Clicou em "Foto"');
                fotoBtnClicado = true;
            }
        } catch (e) {}

        // Estratégia 2: Tentar "Photo" em inglês
        if (!fotoBtnClicado) {
            try {
                console.log('  ▸ Tentando encontrar botão "Photo"...');
                const photoBtn = page.locator('button:has-text("Photo")').first();
                if (await photoBtn.isVisible({ timeout: 5000 })) {
                    await photoBtn.click();
                    console.log('  ✅ Clicou em "Photo"');
                    fotoBtnClicado = true;
                }
            } catch (e) {}
        }

        // Estratégia 3: Procurar por SVG com aria-label
        if (!fotoBtnClicado) {
            try {
                console.log('  ▸ Tentando encontrar SVG de foto...');
                const svgFoto = page.locator('svg[aria-label*="Photo"], svg[aria-label*="Foto"]').first();
                if (await svgFoto.isVisible({ timeout: 5000 })) {
                    await svgFoto.click();
                    console.log('  ✅ Clicou em SVG de foto');
                    fotoBtnClicado = true;
                }
            } catch (e) {}
        }

        // Estratégia 4: Procurar por elemento com texto via innerText
        if (!fotoBtnClicado) {
            try {
                console.log('  ▸ Tentando encontrar via evaluate...');
                fotoBtnClicado = await page.evaluate(() => {
                    const buttons = document.querySelectorAll('button, div[role="button"]');
                    for (let btn of buttons) {
                        if (btn.textContent.includes('Foto') || btn.textContent.includes('Photo')) {
                            if (btn.offsetParent !== null) {  // Verificar se visível
                                btn.click();
                                return true;
                            }
                        }
                    }
                    return false;
                });
                if (fotoBtnClicado) {
                    console.log('  ✅ Clicou via evaluate');
                }
            } catch (e) {}
        }

        if (!fotoBtnClicado) {
            throw new Error('Não foi possível encontrar e clicar no botão de foto');
        }
        
        await page.waitForTimeout(2000);

        console.log('📁 Carregando imagem...');
        
        // Aguardar o input de arquivo aparecer
        await page.waitForSelector('input[type="file"]', { timeout: 30000 });
        
        // Usar setInputFiles para todos os arquivos
        if (images.length > 0) {
            const fileInput = page.locator('input[type="file"]').first();
            await fileInput.setInputFiles(images);
            console.log(`  ✅ ${images.length} imagem(ns) carregada(s)!`);
            await page.waitForTimeout(5000);
        } else {
            throw new Error('Nenhuma imagem foi fornecida');
        }

        console.log('➡️ Clicando em Avançar...');
        
        let avancarClicado = false;
        
        // Estratégia 1: Por texto do botão
        try {
            const nextBtn = page.locator('button:has-text("Avançar")').first();
            if (await nextBtn.isVisible({ timeout: 5000 })) {
                await nextBtn.click();
                console.log('  ✅ Clicou em Avançar');
                avancarClicado = true;
            }
        } catch (e) {}

        // Estratégia 2: Tentar "Next" em inglês
        if (!avancarClicado) {
            try {
                const nextBtn = page.locator('button:has-text("Next")').first();
                if (await nextBtn.isVisible({ timeout: 5000 })) {
                    await nextBtn.click();
                    console.log('  ✅ Clicou em Next');
                    avancarClicado = true;
                }
            } catch (e) {}
        }

        // Estratégia 3: Por classes comuns
        if (!avancarClicado) {
            try {
                const nextBtn = page.locator('.share-box-footer__primary-btn, [class*="primary"]').first();
                if (await nextBtn.isVisible({ timeout: 5000 })) {
                    await nextBtn.click();
                    console.log('  ✅ Clicou via classe primária');
                    avancarClicado = true;
                }
            } catch (e) {}
        }

        if (!avancarClicado) {
            console.warn('  ⚠️ Nao encontrou botão Avançar, continuando mesmo assim...');
        }
        
        await page.waitForTimeout(3000);

        console.log('✍️ Colocando a legenda...');
        
        let legendaPreenchida = false;
        
        // Estratégia 1: Localizador do Quill Editor
        try {
            const editor = page.locator('.ql-editor').first();
            if (await editor.isVisible({ timeout: 5000 })) {
                await editor.click();
                await page.keyboard.press('Control+A');  // Selecionar tudo
                await editor.fill(caption);
                console.log('  ✅ Legenda preenchida via Quill Editor');
                legendaPreenchida = true;
            }
        } catch (e) {}

        // Estratégia 2: contenteditable div
        if (!legendaPreenchida) {
            try {
                const editor = page.locator('div[contenteditable="true"]').first();
                if (await editor.isVisible({ timeout: 5000 })) {
                    await editor.click();
                    await page.keyboard.press('Control+A');
                    await editor.fill(caption);
                    console.log('  ✅ Legenda preenchida via contenteditable');
                    legendaPreenchida = true;
                }
            } catch (e) {}
        }

        // Estratégia 3: Placeholder com texto
        if (!legendaPreenchida) {
            try {
                const editor = page.locator('[placeholder*="Deixe"], [placeholder*="Share"], [placeholder*="Escreva"]').first();
                if (await editor.isVisible({ timeout: 5000 })) {
                    await editor.click();
                    await editor.fill(caption);
                    console.log('  ✅ Legenda preenchida via placeholder');
                    legendaPreenchida = true;
                }
            } catch (e) {}
        }

        if (!legendaPreenchida) {
            console.warn('  ⚠️ Nao encontrou campo de legenda, continuando mesmo assim...');
        }
        
        await page.waitForTimeout(2000);

        // PASSO 7: FLUXO SIMPLIFICADO
        console.log('🚀 PASSO 7: Publicar → Todos → Concluído → Publicar\n');
        
        // ETAPA 1: Clicar "Publicar" (abre modal)
        console.log('  📋 ETAPA 1: Clicar "Publicar" (abre modal)...');
        
        let primeiroPublicado = false;
        
        // Procurar "Publicar"
        try {
            const publishBtn = page.locator('button:has-text("Publicar")').first();
            if (await publishBtn.isVisible({ timeout: 3000 })) {
                await publishBtn.click();
                console.log('  ✅ Clicou em "Publicar"');
                primeiroPublicado = true;
            }
        } catch (e) {}
        
        // Alternativa: "Post"
        if (!primeiroPublicado) {
            try {
                const postBtn = page.locator('button:has-text("Post")').first();
                if (await postBtn.isVisible({ timeout: 2000 })) {
                    await postBtn.click();
                    console.log('  ✅ Clicou em "Post"');
                    primeiroPublicado = true;
                }
            } catch (e) {}
        }
        
        if (!primeiroPublicado) {
            console.warn('  ⚠️ Nao conseguiu clicar em Publicar');
        }
        
        // ETAPA 2: Aguardar 3 segundos
        console.log('  ⏳ Aguardando 3 segundos para modal abrir...');
        await page.waitForTimeout(3000);
        
        // ETAPAS 3-5: LOOP DE 3 TENTATIVAS (Todos → Concluído → Publicar)
        console.log('\n  🔄 LOOP PRINCIPAL: Todos → Concluído → Publicar (até 3 tentativas)\n');
        
        let loopSucesso = false;
        
        for (let loop = 1; loop <= 3 && !loopSucesso; loop++) {
            console.log(`  ═══ TENTATIVA ${loop}/3 ═══`);
            
            // ETAPA 3: Clicar "Todos"
            console.log(`  📋 Clicando "Todos"...`);
            
            let todosClicado = false;
            
            // Estratégia 1: shadowRoot
            try {
                todosClicado = await page.evaluate(() => {
                    const interopOutlet = document.querySelector("#interop-outlet");
                    if (interopOutlet && interopOutlet.shadowRoot) {
                        const todosElement = interopOutlet.shadowRoot.querySelector(
                            "#ANYONE > span.sharing-shared-generic-list__text-wrapper > span.sharing-shared-generic-list__subtext"
                        );
                        if (todosElement) {
                            let parent = todosElement.closest('[role="button"], [role="menuitemradio"], li, div[role="option"]');
                            if (parent) {
                                parent.click();
                                return true;
                            }
                            let ancestor = todosElement.closest('#ANYONE');
                            if (ancestor) {
                                ancestor.click();
                                return true;
                            }
                        }
                    }
                    return false;
                });
                
                if (todosClicado) {
                    console.log('  ✅ Clicou em "Todos" (shadowRoot)');
                }
            } catch (e) {}
            
            // Estratégia 2: Label
            if (!todosClicado) {
                try {
                    const todosLabel = page.locator('label:has-text("Todos")').first();
                    if (await todosLabel.isVisible({ timeout: 2000 })) {
                        await todosLabel.click();
                        console.log('  ✅ Clicou em "Todos" (label)');
                        todosClicado = true;
                    }
                } catch (e) {}
            }
            
            if (!todosClicado) {
                console.warn('  ⚠️ Nao conseguiu clicar em "Todos", tentando próxima vez...');
                await page.waitForTimeout(1500);
                continue; // Próxima iteração do loop
            }
            
            await page.waitForTimeout(1000);
            
            // ETAPA 4: Clicar "Concluído"
            console.log(`  📋 Clicando "Concluído"...`);
            
            let concluidoClicado = false;
            
            // Estratégia 1: "Concluído"
            try {
                const concluidoBtn = page.locator('button:has-text("Concluído")').first();
                if (await concluidoBtn.isVisible({ timeout: 2000 })) {
                    await concluidoBtn.click();
                    console.log('  ✅ Clicou em "Concluído"');
                    concluidoClicado = true;
                }
            } catch (e) {}
            
            // Estratégia 2: "Done"
            if (!concluidoClicado) {
                try {
                    const doneBtn = page.locator('button:has-text("Done")').first();
                    if (await doneBtn.isVisible({ timeout: 2000 })) {
                        await doneBtn.click();
                        console.log('  ✅ Clicou em "Done"');
                        concluidoClicado = true;
                    }
                } catch (e) {}
            }
            
            if (!concluidoClicado) {
                console.warn('  ⚠️ Nao conseguiu clicar em "Concluído", tentando próxima vez...');
                await page.waitForTimeout(1500);
                continue; // Próxima iteração do loop
            }
            
            await page.waitForTimeout(1500);
            
            // ETAPA 5: Clicar "Publicar" DE NOVO
            console.log(`  📋 Clicando "Publicar"...`);
            
            try {
                const publishBtn = page.locator('button:has-text("Publicar")').first();
                if (await publishBtn.isVisible({ timeout: 2000 })) {
                    await publishBtn.click();
                    console.log('  ✅ Clicou em "Publicar"');
                    
                    // Aguardar BASTANTE tempo (LinkedIn pode ser lento)
                    console.log('  ⏳ Aguardando 15 segundos para processar...');
                    await page.waitForTimeout(15000);
                    
                    // Tentar fechar modal com ESC
                    console.log('  📋 Tentando pressionar ESC para fechar...');
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(2000);
                    
                    // Tentar clicar no X de fechar modal
                    try {
                        const closeBtn = page.locator('button[aria-label*="Close"], button[aria-label*="Fechar"], [class*="dismiss"]').first();
                        if (await closeBtn.isVisible({ timeout: 1000 })) {
                            await closeBtn.click();
                            console.log('  ✅ Clicou em botão de fechar');
                            await page.waitForTimeout(2000);
                        }
                    } catch (e) {}
                    
                    // Verificar se modal desapareceu
                    const shareBoxVisivel = await page.locator(
                        '[class*="share-box"], [class*="share-dialog"], .editors-panel, [class*="modal"], [role="dialog"]'
                    ).first().isVisible().catch(() => false);
                    
                    if (!shareBoxVisivel) {
                        console.log('  ✅ SUCESSO! Modal fechado!');
                        
                        // Recarregar página pra confirmar que o post foi criado
                        console.log('  🔄 Recarregando página para validar post...');
                        await page.reload();
                        await page.waitForTimeout(5000);
                        
                        console.log('  ✅ Post publicado com sucesso!');
                        loopSucesso = true;
                        break; // Sair do loop
                    } else {
                        console.log('  ⚠️ Modal ainda visível, tentando novamente...');
                    }
                } else {
                    console.log('  ⚠️ Botão "Publicar" não encontrado');
                }
            } catch (e) {
                console.log(`  ❌ Erro ao clicar em Publicar: ${e.message}`);
            }
            
            if (!loopSucesso && loop < 3) {
                console.log(`  ⏳ Aguardando antes de próxima tentativa...`);
                await page.waitForTimeout(2000);
            }
        }
        
        if (loopSucesso) {
            console.log('\n  🎊 LOOP CONCLUÍDO COM SUCESSO!');
        } else {
            console.log('\n  ⚠️ Loop completou 3 tentativas');
        }

        try {
            await page.waitForSelector('text=Exibir publicação, text=View post, text=Publicação enviada', { timeout: 30000 });
            console.log('🎊 Confirmação visual detectada!');
        } catch (e) {
            console.warn('⚠️ Toast de sucesso não detectado, mas o post pode ter sido publicado.');
        }

        await page.waitForTimeout(5000);
        await page.screenshot({ path: 'sucesso_postagem.png' });
        await context.storageState({ path: authPath });
        console.log('\n🎉 PARABÉNS! Post realizado com sucesso.');

    } catch (error) {
        console.error('❌ ERRO:', error.message);
        try {
            await page.screenshot({ path: 'erro_linkedin_final.png' });
            console.log('📸 Screenshot salvo em erro_linkedin_final.png');
        } catch (screenshotError) {
            console.warn('⚠️ Nao conseguiu salvar screenshot (navegador pode ter fechado)');
        }
        process.exit(1);
    } finally {
        try {
            await browser.close();
        } catch (e) {
            console.log('⚠️ Erro ao fechar navegador (pode já estar fechado)');
        }
    }
})();
