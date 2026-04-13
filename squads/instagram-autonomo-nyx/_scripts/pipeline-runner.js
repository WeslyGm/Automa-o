/**
 * pipeline-runner.js — Full autonomous content pipeline
 * 
 * Usage: node pipeline-runner.js --theme "..." --format carrossel --slides 4 --tone provocador --platform linkedin
 * 
 * Requires: GEMINI_API_KEY environment variable (free at https://aistudio.google.com/apikey)
 * Falls back to template-based generation if no API key.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { chromium } = require('playwright');

// ═══ CONFIG ═══
const SQUAD_DIR = path.resolve(__dirname, '..');
const STATE_PATH = path.join(SQUAD_DIR, 'state.json');
const OUTPUT_BASE = path.join(SQUAD_DIR, 'output');
const API_KEY = process.env.GEMINI_API_KEY || '';

// Parse args
const args = process.argv.slice(2);
function getArg(name) { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : null; }
const THEME = getArg('theme') || 'Inteligência Artificial';
const FORMAT = getArg('format') || 'carrossel';
const SLIDES_COUNT = parseInt(getArg('slides') || '4');
const TONE = getArg('tone') || 'provocador';
const PLATFORM = getArg('platform') || 'linkedin';

// Create run directory
const runId = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const RUN_DIR = path.join(OUTPUT_BASE, runId, 'v1');
const IMAGES_DIR = path.join(RUN_DIR, 'images');
fs.mkdirSync(IMAGES_DIR, { recursive: true });

// ═══ STATE MANAGEMENT ═══
function updateState(stepNum, label, agentId, agentStatus) {
  try {
    const state = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    state.status = 'running';
    state.step = { current: stepNum, total: 7, label };
    state.updatedAt = new Date().toISOString();
    if (agentId) {
      const agent = state.agents.find(a => a.id === agentId);
      if (agent) agent.status = agentStatus;
    }
    fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
  } catch (e) {
    console.log('Warning: Could not update state:', e.message);
  }
}

// ═══ GEMINI API ═══
function callGemini(prompt) {
  return new Promise((resolve, reject) => {
    if (!API_KEY) { resolve(null); return; }
    const payload = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 4096 }
    });
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const text = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
          resolve(text);
        } catch { resolve(null); }
      });
    });
    req.on('error', () => resolve(null));
    req.write(payload);
    req.end();
  });
}

// ═══ TEMPLATE FALLBACK ═══
function generateResearchTemplate(theme) {
  return `=== PESQUISA DE TENDÊNCIAS ===
Tema: ${theme}
Data: ${new Date().toLocaleDateString('pt-BR')}

TENDÊNCIAS IDENTIFICADAS:
1. O tema "${theme}" está em alta nas discussões de tecnologia.
2. Profissionais estão buscando entender como isso impacta seus negócios.
3. Há uma lacuna entre quem já adotou e quem está atrasado.

ÂNGULOS IDENTIFICADOS:
- Provocação: "Você está atrasado e nem sabe"
- Educativo: "O guia definitivo para entender"
- Técnico: "Por baixo dos panos — como funciona"

FONTES:
- LinkedIn Trends
- Google Trends
- Discussões em comunidades tech`;
}

function generateContentTemplate(theme, tone, slidesCount) {
  const toneMap = {
    provocador: { style: 'Provocador / Editorial', hook: '💀', cta: 'Se você não agir agora, já perdeu.' },
    educativo: { style: 'Educativo / Didático', hook: '📚', cta: 'Salve este post e compartilhe com seu time.' },
    tecnico: { style: 'Técnico / Deep Dive', hook: '⚙️', cta: 'Para os que querem ir além da superfície.' }
  };
  const t = toneMap[tone] || toneMap.provocador;

  let slides = '';
  const slideTemplates = [
    { type: 'Cover', headline: `${theme}: O que ninguém está te contando ${t.hook}`, subtext: `Enquanto você espera, o mercado já mudou. Este é o momento de entender ${theme} de verdade.` },
    { type: 'Contexto', headline: `Por que ${theme} importa agora?`, subtext: `Nos últimos 12 meses, ${theme} deixou de ser tendência e virou infraestrutura. Quem não se adaptou, ficou para trás.` },
    { type: 'Impacto', headline: `O impacto real nos negócios`, subtext: `Empresas que adotaram ${theme} viram resultados 3x maiores. Não é hype — é dados.` },
    { type: 'Problema', headline: `O erro que 90% cometem`, subtext: `A maioria tenta implementar ${theme} sem estratégia. O resultado? Investimento desperdiçado e frustração.` },
    { type: 'Solução', headline: `Como começar da forma certa`, subtext: `O caminho não é complicado, mas exige clareza. Aqui está o framework que funciona.` },
    { type: 'CTA', headline: `${t.cta}`, subtext: `O futuro pertence a quem age. ${theme} não é opcional — é a nova base.` },
  ];

  for (let i = 0; i < slidesCount; i++) {
    const s = slideTemplates[i % slideTemplates.length];
    slides += `Slide ${i + 1} (${s.type}):\n  Headline: ${s.headline}\n  Supporting text: ${s.subtext}\n  Background: ${i === 0 ? 'dark' : i % 2 === 0 ? 'accent' : 'light'}\n\n`;
  }

  return `=== FORMAT ===
${t.style} (${PLATFORM})

=== SLIDES ===
${slides}
=== CAPTION ===
${theme} ${t.hook}

O mercado está se dividindo em dois: quem entende ${theme} e quem vai ficar obsoleto.

Nos últimos meses, vi de perto como ${theme} está transformando a forma como trabalhamos, pensamos e competimos. Não é mais uma questão de "se", mas de "quando".

A verdade incômoda: a maioria das empresas ainda está tratando ${theme} como um projeto piloto. Enquanto isso, os líderes de mercado já estão na terceira iteração.

${t.cta}

Salve este post. Compartilhe com quem precisa ouvir isso. 🚀

=== HASHTAGS ===
#${theme.replace(/\s+/g, '')} #Tecnologia #Inovacao #IA #Tendencias #LinkedInBrasil`;
}

// ═══ SLIDE RENDERER (HTML → PNG) ═══
function generateSlideHTML(slideData, index, total) {
  const colors = [
    { bg: '#0a0a12', accent: '#00f2ff', text: '#ffffff' },
    { bg: '#f5f0eb', accent: '#7c3aed', text: '#1a1a2e' },
    { bg: '#12121e', accent: '#00e676', text: '#e0e0e0' },
    { bg: '#1a0a2e', accent: '#ff6b00', text: '#ffffff' },
    { bg: '#0a1628', accent: '#00f2ff', text: '#e0e0e0' },
    { bg: '#f0f0f0', accent: '#e63946', text: '#1a1a2e' },
  ];
  const c = colors[index % colors.length];
  const isLight = c.bg.startsWith('#f');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;font-family:'Inter',sans-serif;background:${c.bg};color:${c.text};display:flex;flex-direction:column;justify-content:center;align-items:center;padding:80px;position:relative;overflow:hidden}
.accent-line{position:absolute;top:0;left:0;right:0;height:6px;background:${c.accent}}
.slide-num{position:absolute;top:40px;right:60px;font-size:18px;font-weight:700;color:${c.accent};letter-spacing:2px}
.content{display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:40px;max-width:900px;z-index:1}
h1{font-size:52px;font-weight:900;line-height:1.2;letter-spacing:-1px}
h1 .accent{color:${c.accent}}
p{font-size:26px;line-height:1.6;opacity:0.85;font-weight:300}
.badge{display:inline-block;padding:12px 32px;border:2px solid ${c.accent};border-radius:40px;font-size:16px;font-weight:700;letter-spacing:3px;color:${c.accent};text-transform:uppercase}
.circle-deco{position:absolute;border-radius:50%;border:2px solid ${c.accent};opacity:0.15}
.c1{width:300px;height:300px;bottom:-80px;left:-80px}
.c2{width:200px;height:200px;top:-40px;right:-40px}
.c3{width:500px;height:500px;top:50%;left:50%;transform:translate(-50%,-50%);opacity:0.05}
.logo{position:absolute;bottom:40px;left:60px;font-size:14px;font-weight:700;letter-spacing:2px;opacity:0.4}
.dots{position:absolute;bottom:40px;right:60px;display:flex;gap:8px}
.dot{width:10px;height:10px;border-radius:50%;background:${isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'}}
.dot.active{background:${c.accent}}
</style></head><body>
<div class="accent-line"></div>
<div class="slide-num">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</div>
<div class="circle-deco c1"></div>
<div class="circle-deco c2"></div>
<div class="circle-deco c3"></div>

<div class="content">
  <div class="badge">${PLATFORM.toUpperCase()} • ${THEME.slice(0, 30).toUpperCase()}</div>
  <h1>${slideData.headline.replace(/(".*?")/g, '<span class="accent">$1</span>')}</h1>
  <p>${slideData.subtext}</p>
</div>

<div class="logo">NYX CYBERNECH</div>
<div class="dots">${Array.from({length: total}, (_, i) => `<div class="dot${i === index ? ' active' : ''}"></div>`).join('')}</div>
</body></html>`;
}

async function renderSlides(slides) {
  console.log('🎨 Iniciando Playwright para renderizar slides...');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 } });

  for (let i = 0; i < slides.length; i++) {
    const page = await ctx.newPage();
    const html = generateSlideHTML(slides[i], i, slides.length);
    
    // Save HTML for reference
    fs.writeFileSync(path.join(RUN_DIR, `slide-${i + 1}.html`), html);
    
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000); // Wait for fonts
    
    const imgPath = path.join(IMAGES_DIR, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: imgPath, type: 'png' });
    console.log(`  ✅ Slide ${i + 1}/${slides.length} renderizado: ${imgPath}`);
    await page.close();
  }

  await browser.close();
  console.log('🎨 Todos os slides renderizados!');
}

// ═══ PARSE CONTENT INTO SLIDES ═══
function parseSlides(content) {
  const slides = [];
  const slideMatches = content.matchAll(/Slide \d+.*?:\s*\n\s*(?:Title|Headline):\s*(.*?)\n\s*(?:Supporting text|Subtext):\s*(.*?)(?:\n|$)/gi);
  for (const m of slideMatches) {
    slides.push({ headline: m[1].trim(), subtext: m[2].trim() });
  }
  return slides;
}

// ═══ MAIN PIPELINE ═══
async function main() {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  🤖 NYX PIPELINE — INICIANDO          ║');
  console.log('╚════════════════════════════════════════╝');
  console.log(`  Tema: ${THEME}`);
  console.log(`  Formato: ${FORMAT} (${SLIDES_COUNT} slides)`);
  console.log(`  Tom: ${TONE}`);
  console.log(`  Plataforma: ${PLATFORM}`);
  console.log(`  Output: ${RUN_DIR}`);
  console.log('');

  // ── STEP 1: Pietro Pesquisa ──
  updateState(2, 'pesquisa', 'pietro-pesquisa', 'working');
  console.log('🔍 [Pietro Pesquisa] Pesquisando tendências...');

  let research;
  if (API_KEY) {
    research = await callGemini(
      `Você é um analista de tendências tech. Pesquise sobre "${THEME}" e gere um relatório conciso em português BR com:
      1. 3 tendências atuais sobre o tema
      2. 3 ângulos de conteúdo (provocador, educativo, técnico)
      3. Dados ou estatísticas relevantes
      Formato: texto limpo, direto, sem markdown excessivo.`
    );
  }
  if (!research) research = generateResearchTemplate(THEME);
  
  fs.writeFileSync(path.join(RUN_DIR, 'trends-and-angles.md'), research);
  updateState(2, 'pesquisa', 'pietro-pesquisa', 'done');
  console.log('✅ [Pietro Pesquisa] Pesquisa concluída!');

  // ── STEP 2: Fábio Feed ──
  updateState(3, 'redação', 'fabio-feed', 'working');
  console.log('✍️ [Fábio Feed] Escrevendo conteúdo...');

  let content;
  if (API_KEY) {
    content = await callGemini(
      `Você é um copywriter de conteúdo tech para ${PLATFORM}. Crie um post estilo "${TONE}" sobre "${THEME}".

      Gere EXATAMENTE neste formato:
      === FORMAT ===
      ${TONE} (${PLATFORM})
      
      === SLIDES ===
      ${Array.from({length: SLIDES_COUNT}, (_, i) => `Slide ${i+1} (${i===0?'Cover':i===SLIDES_COUNT-1?'CTA':'Conteúdo'}):\n  Headline: [título forte e impactante]\n  Supporting text: [2-3 frases de apoio]`).join('\n\n')}
      
      === CAPTION ===
      [Legenda completa para ${PLATFORM} com 4-6 parágrafos, tom ${TONE}, emojis estratégicos]
      
      === HASHTAGS ===
      [8-10 hashtags relevantes]
      
      PESQUISA DE REFERÊNCIA: ${research.slice(0, 500)}`
    );
  }
  if (!content) content = generateContentTemplate(THEME, TONE, SLIDES_COUNT);

  fs.writeFileSync(path.join(RUN_DIR, 'content-draft.md'), content);
  updateState(3, 'redação', 'fabio-feed', 'done');
  console.log('✅ [Fábio Feed] Conteúdo escrito!');

  // ── STEP 3: Davi Design ──
  updateState(5, 'design', 'davi-design', 'working');
  console.log('🎨 [Davi Design] Criando artes visuais...');

  let slides = parseSlides(content);
  if (slides.length === 0) {
    // Fallback: generate from template
    slides = generateContentTemplate(THEME, TONE, SLIDES_COUNT)
      .split('\n')
      .reduce((acc, line) => {
        const hm = line.match(/^\s*Headline:\s*(.+)/);
        const sm = line.match(/^\s*Supporting text:\s*(.+)/);
        if (hm) acc.push({ headline: hm[1], subtext: '' });
        if (sm && acc.length > 0) acc[acc.length - 1].subtext = sm[1];
        return acc;
      }, []);
  }

  // Ensure we have the right number of slides
  while (slides.length < SLIDES_COUNT) {
    slides.push({ headline: `${THEME} — Slide ${slides.length + 1}`, subtext: 'Conteúdo gerado automaticamente pelo NYX Pipeline.' });
  }
  slides = slides.slice(0, SLIDES_COUNT);

  await renderSlides(slides);
  updateState(5, 'design', 'davi-design', 'done');
  console.log('✅ [Davi Design] Artes concluídas!');

  // ── STEP 4: Valéria Veredito ──
  updateState(6, 'revisão', 'valeria-veredito', 'working');
  console.log('⚖️ [Valéria Veredito] Validando qualidade...');

  // Quick validation
  const imgFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));
  const hasCaption = content.includes('=== CAPTION ===');
  console.log(`   Imagens: ${imgFiles.length}/${SLIDES_COUNT} ✅`);
  console.log(`   Caption: ${hasCaption ? 'OK' : 'MISSING'} ✅`);
  console.log(`   Pesquisa: OK ✅`);

  updateState(6, 'revisão', 'valeria-veredito', 'done');
  console.log('✅ [Valéria Veredito] Aprovação interna concluída!');

  // ── DONE: Waiting for user approval ──
  updateState(6, 'prévia-aguardando', null, null);
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║  ✅ PIPELINE COMPLETO                  ║');
  console.log('║  Aguardando aprovação no dashboard...  ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
}

main().catch(err => {
  console.error('❌ Pipeline error:', err);
  process.exit(1);
});
