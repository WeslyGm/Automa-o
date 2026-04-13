const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const dataFile = process.argv[2];
if (!dataFile || !fs.existsSync(dataFile)) {
  console.error("Uso: node criar-arte.js <caminho-para-json-dados>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
const { theme, slides } = data; // slides: [{headline, subtext}]

const OUTPUT_DIR = path.join(__dirname, 'output', 'images');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function formatHeadline(txt) {
  const words = txt.split(' ');
  if (words.length <= 2) return `<span class="highlight">${txt}</span>`;
  const last = words.slice(-2).join(' ');
  const first = words.slice(0, -2).join(' ');
  return `${first} <span class="highlight">${last}</span>`;
}

function generateSlideHTML(headline, subtext, index, total, theme) {
  const isCover = index === 0;

  let logoBase64 = '';
  try {
    const logoPath = path.join(__dirname, 'logo.png');
    if (fs.existsSync(logoPath)) {
      logoBase64 = 'data:image/png;base64,' + fs.readFileSync(logoPath).toString('base64');
    }
  } catch(e) {}

  return `<!DOCTYPE html><html><head><meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { width:1080px; height:1350px; font-family:'Inter',sans-serif; background: #050B14; color:#FFF; position:relative; overflow:hidden; }

/* Camada 1: Background & Linhas */
.bg-grid { position:absolute; width:100%; height:100%; background-image: linear-gradient(rgba(0, 229, 255, 0.04) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 229, 255, 0.04) 2px, transparent 2px); background-size: 60px 60px; z-index: 0; }
.bg-glow { position:absolute; top:-200px; left:-200px; width:800px; height:800px; background: radial-gradient(circle, rgba(0, 122, 255, 0.4) 0%, transparent 70%); filter:blur(80px); z-index:0; }
.bg-glow2 { position:absolute; bottom:-100px; right:-100px; width:800px; height:800px; background: radial-gradient(circle, rgba(0, 229, 255, 0.25) 0%, transparent 70%); filter:blur(80px); z-index:0; }

/* Camada 2: Arquitetura de Divs */
.content { position:relative; z-index:2; display:flex; flex-direction:column; justify-content:center; height:100%; padding:0 100px; }

/* Tag Superior Amarela (Pill) */
.tag-pill { display:inline-block; background-color:#FFD600; color:#000; padding:12px 32px; border-radius:40px; font-size:24px; font-weight:900; text-transform:uppercase; margin-bottom:40px; letter-spacing:1px; align-self: flex-start; box-shadow: 0 10px 30px rgba(255, 214, 0, 0.15); }

/* Tipografia */
h1 { font-size: ${isCover ? '80px' : '65px'}; font-weight:900; line-height:1.15; letter-spacing:-2px; text-transform:uppercase; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
.highlight { color:#00E5FF; }
p { font-size: 32px; line-height:1.6; font-weight:300; opacity:0.9; margin-top:40px; color: #E0E6ED; max-width: 850px; }

/* Camada 3: Geometria (Corte branco inferior da tampa) */
.corner-cut { position:absolute; bottom:-20px; left:-20px; width: 680px; height: 300px; background: #FFFFFF; clip-path: polygon(0 40%, 100% 100%, 0 100%); z-index:1; }

/* Logo Soluntel */
.soluntel-logo { position:absolute; bottom:60px; left:80px; z-index:10; display:flex; align-items:center; gap:16px; }
.s-icon { display:flex; gap:6px; align-items:flex-end; height:45px; }
.s-icon-img { height: 60px; width: auto; object-fit: contain; }
.s-bar { width:14px; border-radius:2px; }
.s-bar.b1 { height:30px; background:#E63946; } 
.s-bar.b2 { height:45px; background:#00E5FF; } 
.s-bar.b3 { height:35px; background:#0052CC; } 
.s-text { font-size:36px; font-weight:900; letter-spacing:2px; color: #0A1128; }
.soluntel-logo.internal .s-text { color: #FFFFFF; }

/* Indicadores */
.dots { position:absolute; bottom:80px; right:80px; display:flex; gap:12px; z-index:10; }
.dot { width:14px; height:14px; border-radius:50%; background:rgba(255,255,255,0.2); transition: 0.3s; }
.dot.on { background:#FFD600; box-shadow: 0 0 15px rgba(255, 214, 0, 0.6); width:40px; border-radius:10px; }
</style></head><body>

<div class="bg-grid"></div><div class="bg-glow"></div><div class="bg-glow2"></div>

${isCover ? '<div class="corner-cut"></div>' : ''}

<div class="content">
  <div class="tag-pill">${theme.slice(0, 35)}</div>
  <h1>${formatHeadline(headline)}</h1>
  <p>${subtext}</p>
</div>

<div class="soluntel-logo ${isCover ? '' : 'internal'}">
  ${logoBase64 ? '<img src="' + logoBase64 + '" class="s-icon-img" />' : '<div class="s-icon"><div class="s-bar b1"></div><div class="s-bar b2"></div><div class="s-bar b3"></div></div>'}
  <div class="s-text">SOLUNTEL</div>
</div>

<div class="dots">${Array.from({length:total},(_,i)=>'<div class="dot'+(i===index?' on':'')+'"></div>').join('')}</div>
</body></html>`;
}

(async () => {
  console.log('🎨 Iniciando renderização das artes via Playwright...');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1080, height: 1350 } });

  const outputImages = [];
  
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const html = generateSlideHTML(s.headline, s.subtext, i, slides.length, theme);
    const page = await ctx.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const imgPath = path.join(OUTPUT_DIR, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: imgPath, type: 'png' });
    await page.close();
    console.log(`   ✅ Slide ${i + 1}/${slides.length} criado: ${imgPath}`);
    outputImages.push(imgPath);
  }
  await browser.close();
  
  // Salvar um artefatos para o bot ler depois
  fs.writeFileSync('output-run.json', JSON.stringify({ images: outputImages, caption: data.caption }));
  console.log('🎉 Todas as artes foram geradas com sucesso!');
})();
