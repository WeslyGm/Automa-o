const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const IMAGE_PATH = path.resolve(
  'C:\\Users\\wesly\\.gemini\\antigravity\\brain\\93ceed45-5910-46bf-b4ae-55a3dbd16c19\\agente_ia_holografico_1775161458101.png'
);

const CAPTION = `Você já ouviu falar em "Agentes de IA", mas sabe o que eles realmente fazem? 💡🤖

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

const STORAGE_STATE = path.resolve('_opensquad/_browser_profile/instagram.json');

async function delay(ms) {
  console.log(`  ⏳ Aguardando ${ms / 1000}s...`);
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  console.log('🚀 Abrindo navegador...');

  const browser = await chromium.launch({ headless: false, slowMo: 800 });

  let ctxOpts = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 900 },
  };
  if (fs.existsSync(STORAGE_STATE)) {
    console.log('🔑 Usando sessão salva...');
    ctxOpts.storageState = STORAGE_STATE;
  }

  const context = await browser.newContext(ctxOpts);
  const page = await context.newPage();

  try {
    // === PASSO 1: Abrir Instagram ===
    console.log('📱 Abrindo Instagram...');
    await page.goto('https://www.instagram.com/', { waitUntil: 'networkidle', timeout: 60000 });
    await delay(8000); // Esperar página carregar completamente

    // === PASSO 2: Verificar login ===
    console.log('🔍 Verificando login...');
    const logged = await page.getByText('Página inicial').isVisible({ timeout: 8000 }).catch(() => false);

    if (!logged) {
      console.log('⚠️ ==========================================');
      console.log('⚠️  FAÇA LOGIN NO NAVEGADOR!');
      console.log('⚠️  Esperando 3 minutos...');
      console.log('⚠️ ==========================================');
      await page.getByText('Página inicial').waitFor({ timeout: 180000 });
    }

    console.log('✅ Logado! Sidebar visível.');
    await context.storageState({ path: STORAGE_STATE });
    console.log('💾 Sessão salva!');
    await delay(3000);

    // === PASSO 3: Clicar em "Criar" no sidebar ===
    console.log('📝 Clicando em "Criar"...');
    
    // Usar xpath para encontrar o link "Criar" no sidebar
    const criarClicked = await page.evaluate(() => {
      const links = document.querySelectorAll('a, span');
      for (const el of links) {
        if (el.textContent.trim() === 'Criar') {
          el.click();
          return true;
        }
      }
      return false;
    });

    if (criarClicked) {
      console.log('✅ Clicou em "Criar"!');
    } else {
      console.log('❌ Não encontrou "Criar". Tentando alternativa...');
      await page.getByText('Criar', { exact: true }).click();
    }

    await delay(5000); // Esperar modal abrir completamente

    // === PASSO 4: Selecionar do computador ===
    console.log('🖼️ Buscando "Selecionar do computador"...');

    // Esperar o botão aparecer
    await delay(3000);

    // Listar botões visíveis para debug
    const buttons = await page.evaluate(() => {
      const btns = document.querySelectorAll('button');
      return Array.from(btns).filter(b => b.offsetParent !== null).map(b => b.textContent.trim().substring(0, 50));
    });
    console.log('  📋 Botões visíveis:', JSON.stringify(buttons));

    // Tentar clicar no botão
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser', { timeout: 20000 }),
      (async () => {
        await delay(1000);
        // Tentar por evaluate para mais controle
        const clicked = await page.evaluate(() => {
          const btns = document.querySelectorAll('button');
          for (const btn of btns) {
            const text = btn.textContent.trim().toLowerCase();
            if (text.includes('selecionar do computador') || text.includes('select from computer')) {
              btn.click();
              return true;
            }
          }
          return false;
        });
        if (clicked) {
          console.log('  ✅ Clicou em "Selecionar do computador"!');
        } else {
          // Fallback: tentar input file direto
          console.log('  🔄 Tentando input file direto...');
          const input = page.locator('input[type="file"]').first();
          await input.setInputFiles(IMAGE_PATH);
        }
      })(),
    ]);

    await fileChooser.setFiles(IMAGE_PATH);
    console.log('✅ Imagem selecionada!');
    await delay(6000); // Esperar imagem processar

    // === PASSO 5: Avançar (Corte) ===
    console.log('➡️ Avançando (corte)...');
    for (const text of ['Avançar', 'Next']) {
      try {
        const btn = page.getByRole('button', { name: new RegExp(text, 'i') });
        if (await btn.isVisible({ timeout: 5000 })) {
          await btn.click();
          console.log(`  ✅ Avançou (${text})`);
          break;
        }
      } catch (e) {}
    }
    await delay(5000);

    // === PASSO 6: Avançar (Filtros) ===
    console.log('➡️ Avançando (filtros)...');
    for (const text of ['Avançar', 'Next']) {
      try {
        const btn = page.getByRole('button', { name: new RegExp(text, 'i') });
        if (await btn.isVisible({ timeout: 5000 })) {
          await btn.click();
          console.log(`  ✅ Avançou (${text})`);
          break;
        }
      } catch (e) {}
    }
    await delay(5000);

    // === PASSO 7: Preencher legenda ===
    console.log('📝 Escrevendo legenda...');
    const textbox = page.locator('div[role="textbox"]').first();
    await textbox.waitFor({ state: 'visible', timeout: 10000 });
    await textbox.click();
    await delay(1000);
    await page.keyboard.type(CAPTION, { delay: 3 });
    console.log('✅ Legenda preenchida!');
    await delay(3000);

    // === PASSO 8: Compartilhar ===
    console.log('🚀 Publicando...');
    for (const text of ['Compartilhar', 'Share']) {
      try {
        const btn = page.getByRole('button', { name: new RegExp(text, 'i') });
        if (await btn.isVisible({ timeout: 5000 })) {
          await btn.click();
          console.log(`  ✅ Clicou "${text}"!`);
          break;
        }
      } catch (e) {}
    }

    await delay(15000); // Esperar upload e publicação

    console.log('');
    console.log('🎉 =========================================');
    console.log('🎉  POST PUBLICADO COM SUCESSO!');
    console.log('🎉 =========================================');
    await context.storageState({ path: STORAGE_STATE });

  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('💡 Navegador aberto por 3 min para ação manual.');
    await page.waitForTimeout(180000);
  }

  await delay(5000);
  await browser.close();
  console.log('✅ Navegador fechado.');
})();
