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
  }

  // Fallback: se não passar args, procurar imagens na pasta output/images/
  if (images.length === 0) {
    const imagesDir = path.resolve('squads/instagram-autonomo-nyx/output/images');
    if (fs.existsSync(imagesDir)) {
      images = fs.readdirSync(imagesDir)
        .filter(f => /\.(png|jpg|jpeg)$/i.test(f))
        .sort()
        .map(f => path.join(imagesDir, f));
    }
  }

  return { images, caption };
}

// ━━━━ Helpers ━━━━
async function clickBtn(page, names, timeout = 5000) {
  for (const name of names) {
    try {
      const btn = page.getByRole('button', { name: new RegExp(name, 'i') });
      if (await btn.isVisible({ timeout })) {
        await btn.click();
        console.log(`  ✅ Clicou: "${name}"`);
        return true;
      }
    } catch (e) {}
  }
  return false;
}

async function fecharPopups(page) {
  const textos = [
    'Agora não', 'Not Now', 'Not now', 'Cancel', 'Cancelar',
    'Decline optional cookies', 'Recusar cookies opcionais',
    'Permitir apenas cookies essenciais', 'Pular', 'Skip'
  ];
  
  // Tenta clicar usando regex exato e difuso
  for (const texto of textos) {
    try {
      // Usar xpath para maior poder de alcance, ex: procura botão onde texto inclua "Agora não"
      const btn = page.getByRole('button', { name: new RegExp(texto, 'i') });
      if (await btn.isVisible({ timeout: 1500 })) {
        await btn.click();
        console.log(`  🚫 Popup fechado via Role: "${texto}"`);
        await page.waitForTimeout(1000);
      }
    } catch (e) {}
  }
  
  // Tentativa alternativa forçada via XPath (caso esteja aninhado e o Playwright sofra o bypass da role)
  try {
    for (const texto of textos) {
      const el = page.locator(`button:has-text("${texto}")`).first();
      if (await el.isVisible({ timeout: 500 })) {
        await el.click();
        console.log(`  🚫 Popup fechado via Loc: "${texto}"`);
        await page.waitForTimeout(1000);
      }
    }
  } catch (e) {}

  // Se houver modal atrapalhando o botão principal de click em 'Criar', 
  // um esc pressionado no body pode ajudar (caso o Instagram suporte escape button no popup de notificações)
  await page.keyboard.press('Escape');
}

async function clickCriar(page) {
  let clicked = await page.evaluate(() => {
    const els = document.querySelectorAll('a, span, div');
    for (const el of els) {
      const text = el.textContent.trim();
      if (text === 'Criar' || text === 'Create') {
        el.click();
        return true;
      }
    }
    return false;
  });

  if (clicked) {
    console.log('  ✅ Clicou em Criar!');
    return;
  }

  // Fallback: SVG
  for (const label of ['Criar', 'Create', 'New post', 'Nova publicação']) {
    try {
      const svg = page.locator(`svg[aria-label="${label}"]`).first();
      if (await svg.isVisible({ timeout: 2000 })) {
        await svg.click();
        console.log(`  ✅ Clicou via SVG: "${label}"`);
        return;
      }
    } catch (e) {}
  }

  throw new Error('Não encontrou botão "Criar"');
}

// ━━━━ Main ━━━━
(async () => {
  const { images, caption } = parseArgs();

  if (images.length === 0) {
    console.error('❌ Nenhuma imagem encontrada. Use --images "img1.png,img2.png" ou coloque imagens em output/images/');
    process.exit(1);
  }

  // Validar que os arquivos existem
  for (const img of images) {
    if (!fs.existsSync(img)) {
      console.error(`❌ Imagem não encontrada: ${img}`);
      process.exit(1);
    }
  }

  const isCarousel = images.length > 1;
  console.log(`🚀 Iniciando postagem...`);
  console.log(`📐 Formato: ${isCarousel ? `Carrossel (${images.length} imagens)` : 'Post Único'}`);
  console.log(`📸 Imagens: ${images.map(i => path.basename(i)).join(', ')}`);
  if (caption) console.log(`📝 Legenda: ${caption.substring(0, 80)}...`);

  const browser = await chromium.launch({
    headless: false,
    slowMo: 1500,
    executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    args: ['--disable-blink-features=AutomationControlled']
  });

  const context = await browser.newContext({
    storageState: 'auth.json',
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // ━━━━ 1. Abrir Instagram ━━━━
    console.log('🔗 Acessando Instagram...');
    await page.goto('https://www.instagram.com/', { timeout: 60000 });
    await page.waitForTimeout(8000);
    console.log('✅ Página carregada!');

    // ━━━━ 2. Fechar popups ━━━━
    console.log('🚫 Fechando popups...');
    await fecharPopups(page);
    await page.waitForTimeout(2000);

    // ━━━━ 3. Clicar em Criar ━━━━
    console.log('📸 Clicando em Criar...');
    
    // Método 1: Clicar no link/botão da sidebar com texto exato "Criar"
    let criarClicked = false;
    for (const selector of [
      'a:has(span:text-is("Criar"))',
      'div[role="button"]:has(span:text-is("Criar"))',
      'a:has(span:text-is("Create"))',
      'svg[aria-label="Nova publicação"]',
      'svg[aria-label="New post"]',
      'svg[aria-label="Criar"]',
      'svg[aria-label="Create"]'
    ]) {
      try {
        const el = page.locator(selector).first();
        if (await el.isVisible({ timeout: 1500 })) {
          await el.click();
          console.log(`  ✅ Clicou em Criar via: ${selector}`);
          criarClicked = true;
          break;
        }
      } catch(e) {}
    }
    
    if (!criarClicked) {
      // Fallback: clique via evaluate no texto exato da sidebar
      await clickCriar(page);
    }
    
    await page.waitForTimeout(3000);
    
    // ━━━━ 3b. Submenu: Postar ━━━━
    // Após clicar em "Criar", a sidebar expande mostrando opções (Postar, Reel, etc.)
    // Usamos evaluate para LOCALIZAR o elemento, mas Playwright mouse.click() para CLICAR (React precisa de evento real)
    console.log('📌 Procurando botão "Postar" no submenu...');
    
    // Localiza as coordenadas do botão "Postar"
    const postarCoords = await page.evaluate(() => {
      const candidatos = document.querySelectorAll('a, span, div[role="button"]');
      for (const el of candidatos) {
        const texto = el.textContent ? el.textContent.trim() : '';
        if (texto === 'Postar' || texto === 'Post') {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && rect.top >= 0) {
            return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2, texto };
          }
        }
      }
      return null;
    });

    if (postarCoords) {
      // Clique real via Playwright (simula mouse humano, dispara React events)
      await page.mouse.click(postarCoords.x, postarCoords.y);
      console.log(`  ✅ Clicou em "${postarCoords.texto}" nas coordenadas (${Math.round(postarCoords.x)}, ${Math.round(postarCoords.y)})!`);
    } else {
      console.log('  ⚠️ Botão "Postar" não encontrado no submenu.');
      await page.screenshot({ path: 'debug_submenu.png' });
    }
    
    await page.waitForTimeout(3000);
    await fecharPopups(page);

    // ━━━━ 4. Selecionar imagem(ns) ━━━━
    console.log(`📁 Selecionando ${images.length} imagem(ns)...`);
    
    // Método direto: injetar arquivos via input[type="file"] oculto (mais confiável)
    let uploaded = false;
    try {
      const fileInput = page.locator('input[type="file"]').first();
      // Força visibilidade temporária se estiver oculto
      await fileInput.evaluate(el => el.style.display = 'block');
      await fileInput.setInputFiles(images);
      console.log(`  ✅ ${images.length} imagem(ns) injetada(s) via input[type=file]!`);
      uploaded = true;
    } catch(e) {
      console.log('  ⚠️ Input file não encontrado, tentando botão visual...');
    }
    
    // Fallback: botão visual "Selecionar do computador"  
    if (!uploaded) {
      const fileChooserPromise = page.waitForEvent('filechooser', { timeout: 15000 });
      await clickBtn(page, ['Select from computer', 'Selecionar do computador', 'Selecionar no computador']);
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(images);
      console.log(`  ✅ ${images.length} imagem(ns) selecionada(s) via filechooser!`);
    }
    
    await page.waitForTimeout(5000);

    // ━━━━ 5. Avançar (Crop) ━━━━
    console.log('➡️ Crop → Next...');
    await clickBtn(page, ['Next', 'Avançar']);
    await page.waitForTimeout(3000);

    // ━━━━ 6. Avançar (Filtros) ━━━━
    console.log('➡️ Edit → Next...');
    await clickBtn(page, ['Next', 'Avançar']);
    await page.waitForTimeout(3000);

    // ━━━━ 7. Escrever legenda ━━━━
    if (caption) {
      console.log('✍️ Escrevendo legenda...');
      const campoTexto = page.locator('div[role="textbox"]').first();
      await campoTexto.click();
      await page.waitForTimeout(500);
      await campoTexto.fill(caption);
      console.log('✅ Legenda preenchida!');
      await page.waitForTimeout(2000);
    }

    // ━━━━ 8. Publicar ━━━━
    console.log('🚀 Publicando...');
    await clickBtn(page, ['Share', 'Compartilhar']);
    await page.waitForTimeout(15000);

    // Salvar sessão atualizada
    await context.storageState({ path: 'auth.json' });

    console.log('');
    console.log('🎉 =========================================');
    console.log(`🎉  POST ${isCarousel ? 'CARROSSEL' : 'ÚNICO'} PUBLICADO COM SUCESSO!`);
    console.log(`🎉  ${images.length} imagem(ns) enviada(s)`);
    console.log('🎉 =========================================');

  } catch (error) {
    console.error('❌ Erro:', error.message);
    await page.screenshot({ path: 'erro_postagem.png' });
    console.log('📸 Screenshot salvo em erro_postagem.png');
    console.log('💡 Encerrando a instância atual para tentar novamente...');
    await page.waitForTimeout(2000);
  } finally {
    await browser.close();
  }
})();
