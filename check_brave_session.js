const { chromium } = require('playwright'); // Importa a biblioteca Playwright para controlar o navegador
const path = require('path'); // Importa a biblioteca 'path' nativa do Node para manipular caminhos de arquivos

(async () => {
    // Define o caminho para a pasta onde ficam os perfis de usuário, cookies e sessões salvas do navegador Brave
    const userDataDir = path.join(process.env.LOCALAPPDATA, 'BraveSoftware', 'Brave-Browser', 'User Data');
    
    // Caminho completo do executável do Brave no Windows
    const executablePath = 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe';

    console.log('🚀 Tentando abrir o Brave com perfil persistente...');
    console.log(`📍 User Data: ${userDataDir}`);

    try {
        // Inicia o navegador mantendo a sessão do usuário (cookies, senhas) carregada
        const context = await chromium.launchPersistentContext(userDataDir, {
            executablePath: executablePath, // Usa o Brave em vez do Chrome/Edge padrão
            headless: false, // Define 'false' para que o navegador se abra visivelmente na tela
            viewport: { width: 1280, height: 800 }, // Define o tamanho da tela do navegador
            args: ['--profile-directory=Default'] // Força o uso do Perfil Padrão do navegador para herdar contas logadas
        });

        const page = await context.newPage(); // Abre uma nova aba no navegador
        console.log('🔗 Acessando LinkedIn para verificar sessão...');
        
        // Vai para a página do Feed do LinkedIn, com tempo de espera de até 60 segundos
        await page.goto('https://www.linkedin.com/feed/', { timeout: 60000 });
        
        // Espera 5 segundos na página para dar tempo de carregar os elementos e o login verificar credenciais
        await page.waitForTimeout(5000);

        const url = page.url(); // Pega a URL atual depois que a página carregou
        console.log(`📍 URL atual: ${url}`);

        // Checa se a palavra 'feed' está na URL da página atual, o que indica que o login deu certo
        if (url.includes('feed')) {
            console.log('✅ SUCESSO: Você está logado no Brave!');
        } else {
            console.log('⚠️ AVISO: Não parece estar no Feed. Pode ser necessário login manual uma única vez ou fechar o Brave.');
        }

        // Tira uma captura de tela da página que abriu e salva na pasta atual como 'check_brave_result.png'
        await page.screenshot({ path: 'check_brave_result.png' });
        console.log('📸 Screenshot salvo em check_brave_result.png');

        await context.close(); // Fecha o contexto e o navegador depois de tudo concluído
        console.log('✅ Navegador fechado.');
    } catch (error) {
        // Se acontecer alguma falha (ex: o navegador já estava aberto na máquina), ele cai neste bloco
        console.error('❌ ERRO:', error.message);
        
        // Erro comum: Arquivo da sessão travado porque o usuário já abriu o Brave manualmente
        if (error.message.includes('lock')) {
            console.error('💡 DICA: O Brave parece estar aberto. Feche-o completamente e tente de novo.');
        }
    }
})();
