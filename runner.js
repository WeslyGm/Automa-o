const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('dados.json', 'utf-8'));

// Executar criação de arte
console.log('--- 1. CRIANDO AS ARTES ---');
const resArte = spawnSync('node', ['criar-arte.js', 'dados.json'], { stdio: 'inherit' });
if (resArte.status !== 0) process.exit(resArte.status);

// Ler imagens da pasta
let imagesDir = path.join(__dirname, 'output', 'images');
const images = fs.readdirSync(imagesDir)
  .filter(f => f.endsWith('.png'))
  .map(f => path.join(imagesDir, f));

// Executar postar-auto
console.log('\\n--- 2. PUBLICANDO NO INSTAGRAM ---');
const args = ['squads/instagram-autonomo-nyx/_scripts/postar-auto.js', '--images', images.join(','), '--caption', data.caption];

let MAX_RETRIES = 2;
let attempt = 1;
let success = false;

while (attempt <= MAX_RETRIES && !success) {
  if (attempt > 1) {
    console.log(`\n⚠️  FALHA NA PRIMEIRA. TENTATIVA ${attempt}/${MAX_RETRIES} DE POSTAGEM...`);
    // Um sleep rápido pro sistema dar um bypass na segurança temporária
    spawnSync('node', ['-e', 'setTimeout(()=>{}, 4000)']);
  }
  
  const resPost = spawnSync('node', args, { stdio: 'inherit', cwd: __dirname });
  if (resPost.status !== 0) {
    console.log(`❌ Falha na postagem na tentativa ${attempt}.`);
    attempt++;
  } else {
    console.log('✅ Feito com sucesso na tentativa ' + attempt + '!');
    success = true;
  }
}

if (!success) {
  console.error('\\n❌ TODAS AS TENTATIVAS FALHARAM! O INSTAGRAM PODE ESTAR IMPEDINDO.');
}
