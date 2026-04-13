const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const CAMINHO_IMAGEM = path.resolve(
    'C:\\Users\\wesly\\.gemini\\antigravity\\brain\\93ceed45-5910-46bf-b4ae-55a3dbd16c19\\agente_ia_holografico_1775161458101.png'
  );

  const LEGENDA = `Você já ouviu falar em "Agentes de IA", mas sabe o que eles realmente fazem? 💡🤖

Diferente de um chatbot comum, um Agente de IA é um sistema completo que:

⚙️ Lê seus dados — CRM, planilhas, e-mails, tudo.
🧠 Toma decisões — com base em regras que VOCÊ define.
🚀 Executa tarefas — sem precisar de supervisão constante.

Imagine ter um funcionário digital que nunca esquece uma tarefa, nunca atrasa uma entrega e trabalha 24 horas por dia.

Na NYX Cybernech, nós projetamos e implementamos esses agentes sob medida para o seu negócio:

✨ Landing Pages Imersivas que convertem visitantes em clientes.
🤖 Automação Inteligente que elimina o trabalho repetitivo.
🎬 Edição Profissional com IA que acelera sua produção visual.

O futuro da produtividade não é trabalhar mais. É automatizar melhor.`;

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

    // 1. Clicar em Criar/Create - buscar por texto dentro de qualquer elemento
    console.log("📸 Clicando em Criar...");
    let clicked = false;
    
    // Buscar todos os links da página que contêm "Criar" ou "Create"
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
      // Fallback: clicar no SVG "+" diretamente
      console.log("  🔄 Tentando via SVG...");
      const svgs = await page.locator('svg').all();
      console.log(`  📋 ${svgs.length} SVGs na página`);
      
      // O ícone "+" geralmente tem um path com "M" específico ou está perto do final do sidebar
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
    await fecharPopups(page); // Fechar popups que possam ter aparecido

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
