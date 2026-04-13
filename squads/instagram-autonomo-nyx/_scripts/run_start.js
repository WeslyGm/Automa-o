const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const theme = args[args.indexOf('--theme') + 1];
const format = args[args.indexOf('--format') + 1];
const platform = args[args.indexOf('--platform') + 1];

const statePath = path.resolve('state.json');

console.log(`🚀 SQUAD DEPLOYED!`);
console.log(`Theme: ${theme}`);
console.log(`Format: ${format}`);
console.log(`Platform: ${platform}`);

// 1. Update state.json to start the run
const state = JSON.parse(fs.readFileSync(statePath, 'utf-8'));
state.status = "running";
state.step = { current: 2, total: 7, label: "pesquisa" };
state.updatedAt = new Date().toISOString();

// Mark agents as idle/working
state.agents.forEach(a => {
    if (a.id === 'pietro-pesquisa') a.status = 'working';
    else a.status = 'idle';
});

fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

console.log(`✅ State updated. Pietro is starting research...`);
