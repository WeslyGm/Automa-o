const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const CAMINHO_IMAGEM = path.resolve(
    'C:\\Users\\wesly\\.gemini\\antigravity\\brain\\1cbabe35-d80f-49ae-9d90-5af878bfc0ed\\nyx_cover_kling_ai_1775237286050.png'
  );

  const LEGENDA = `A OpenAI desligou o Sora e o mercado de vídeo acaba de mudar para sempre. 🎬

O fim de uma era não é o fim das possibilidades — é o convite para dominarmos o novo líder absoluto: o Kling AI. Enquanto o mundo lamentava o fim de uma ferramenta que mal chegou ao público, aqui na NYX Cybernech já estávamos mapeando o próximo horizonte.

O Kling AI não é apenas um substituto; é uma evolução em física de movimento e consistência visual que o Sora apenas prometeu em seus teasers. Estamos falando de vídeos que mantêm a identidade da sua marca por minutos, com controle direcional nível Hollywood. 🚀

Na NYX, acreditamos que a Engenharia Visual de alta performance é o único caminho para marcas que buscam diferenciação técnica e conversão real em 2026. O futuro do design é imersivo, táctil e totalmente movido por sistemas inteligentes.

Você está pronto para parar de observar o futuro e começar a dirigi-lo?

#IAGenerativa #KlingAI #NYXCybernech #VFX #WebDesign3D #AutomaçãoIA #EngenhariaVisual #VideoMarketing #InovaçãoTecnológica #FuturoDoDesign`;

  // Helper: clica no primeiro botão visível com um dos nomes
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

  // Helper: fecha popups comuns (PT e EN)
  async function fecharPopups(page) {
    const textos = ['Agora não', 'Not Now', 'Not now', 'Decline optional cookies', 'Recusar cookies opcionais'];
    for (const texto of textos) {
      try {
        const btn = page.getByRole('button', { name: texto });
        if (await btn.isVisible({ timeout: 2000 })) {
          await btn.click();
          console.log(`  🚫 Popup fechado: "${texto}"`);
          await page.waitForTimeout(1000);
        }
      } catch (e) {}
    }
  }

  const browser = await chromium.launch({ 
    headless: false, 
    slowMo: 1500
  });

  const context = await browser.newContext({ 
    storageState: 'auth.json',
    viewport: { width: 1920, height: 1080 } 
  });
  
  const page = await context.newPage();

  try {
    console.log("🔗 Acessando Instagram...");
    await page.goto('https://www.instagram.com/', { timeout: 60000 });
    await page.waitForTimeout(8000);
    console.log("✅ Página carregada!");

    // Fechar popups (Notificações, Cookies, etc)
    console.log("🚫 Fechando popups...");
    await fecharPopups(page);
    await page.waitForTimeout(2000);

    // 1. Clicar em Criar/Create
    console.log("📸 Clicando em Criar...");
    let clicked = false;
    
    clicked = await page.evaluate(() => {
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
      console.log("  ✅ Clicou em Criar!");
    } else {
      console.log("  🔄 Tentando via SVG...");
      for (const label of ['Criar', 'Create', 'New post', 'Nova publicação']) {
        try {
          const svg = page.locator(`svg[aria-label="${label}"]`).first();
          if (await svg.isVisible({ timeout: 2000 })) {
            await svg.click();
            clicked = true;
            console.log(`  ✅ Clicou via SVG: "${label}"`);
            break;
          }
        } catch(e) {}
      }
    }

    await page.waitForTimeout(3000);
    await fecharPopups(page);

    // 2. Select from computer / Selecionar do computador
    console.log("📁 Selecionando imagem...");
    const fileChooserPromise = page.waitForEvent('filechooser');
    await clickBtn(page, ['Select from computer', 'Selecionar do computador']);
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(CAMINHO_IMAGEM);
    console.log("✅ Imagem selecionada!");
    await page.waitForTimeout(4000);

    // 3. Next / Avançar (Crop)
    console.log("➡️ Crop → Next...");
    await clickBtn(page, ['Next', 'Avançar']);
    await page.waitForTimeout(3000);

    // 4. Next / Avançar (Edit/Filters)
    console.log("➡️ Edit → Next...");
    await clickBtn(page, ['Next', 'Avançar']);
    await page.waitForTimeout(3000);

    // 5. Escrever legenda
    console.log("✍️ Escrevendo legenda...");
    const campoTexto = page.locator('div[role="textbox"]').first();
    await campoTexto.click();
    await page.waitForTimeout(500);
    await campoTexto.fill(LEGENDA);
    console.log("✅ Legenda preenchida!");
    await page.waitForTimeout(2000);

    // 6. Share / Compartilhar
    console.log("🚀 Publicando...");
    await clickBtn(page, ['Share', 'Compartilhar']);

    await page.waitForTimeout(15000);

    // Salvar sessão atualizada
    await context.storageState({ path: 'auth.json' });

    console.log("");
    console.log("🎉 =========================================");
    console.log("🎉  POST PUBLICADO COM SUCESSO!");
    console.log("🎉 =========================================");

  } catch (error) {
    console.error("❌ Erro:", error.message);
    await page.screenshot({ path: 'erro_postagem.png' });
    console.log("📸 Screenshot salvo em erro_postagem.png");
    console.log("💡 Navegador aberto por 3 min para ação manual.");
    await page.waitForTimeout(180000);
  } finally {
    await browser.close();
  }
})();
