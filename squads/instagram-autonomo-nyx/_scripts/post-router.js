const { spawn } = require('child_process');
const readline = require('readline');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const args = process.argv.slice(2);

console.log('\n=========================================');
console.log('   SQUAD AUTO-POST - SELEÇÃO DE CANAL');
console.log('=========================================\n');
console.log('1. Instagram');
console.log('2. LinkedIn');
console.log('q. Sair\n');

rl.question('Escolha para onde deseja postar (1 ou 2): ', (answer) => {
    let script = '';
    
    if (answer === '1') {
        script = 'postar-auto.js';
    } else if (answer === '2') {
        script = 'post-linkedin.js';
    } else {
        console.log('Saindo...');
        rl.close();
        process.exit(0);
    }

    const scriptPath = path.resolve(__dirname, script);
    console.log(`\n🚀 Iniciando script: ${script}`);
    console.log(`📍 Caminho: ${scriptPath}\n`);

    const child = spawn('node', [`"${scriptPath}"`, ...args], {
        stdio: 'inherit',
        shell: true
    });

    child.on('close', (code) => {
        console.log(`\nScript finalizado com código ${code}`);
        rl.close();
        process.exit(code);
    });
});
