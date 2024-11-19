const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Caminhos dos projetos
const oldProjectPath = '/workspaces/freecodecamp-backend';
const newProjectPath = '/workspaces/freecodecamp-novo';

// Criar novo projeto Next.js
console.log('Creating new Next.js project...');
execSync(`npx create-next-app@latest ${newProjectPath} --ts --use-npm`, { stdio: 'inherit' });

// Mover arquivos estáticos para o novo projeto
console.log('Moving static files...');
fs.mkdirSync(path.join(newProjectPath, 'public'), { recursive: true });
fs.copyFileSync(path.join(oldProjectPath, 'public/style.css'), path.join(newProjectPath, 'public/style.css'));

// Criar pastas para APIs e mover controladores
console.log('Setting up API routes...');
const apiPath = path.join(newProjectPath, 'pages/api');
fs.mkdirSync(apiPath, { recursive: true });

// Função para mover arquivos de controladores para rotas de API
const moveControllersToAPI = () => {
  const controllerFiles = [
    { old: 'urlShortenerController.js', new: 'urlShortener.js' },
    { old: 'exerciseTrackerController.js', new: 'exerciseTracker.js' },
    { old: 'dateController.js', new: 'date.js' },
    { old: 'whoamiController.js', new: 'whoami.js' },
    { old: 'fileMetadataController.js', new: 'fileMetadata.js' },
  ];

  controllerFiles.forEach(file => {
    const oldFilePath = path.join(oldProjectPath, 'controllers', file.old);
    const newFilePath = path.join(apiPath, file.new);
    fs.copyFileSync(oldFilePath, newFilePath);
    console.log(`Moved ${file.old} to API route ${file.new}`);
  });
};

moveControllersToAPI();

// Copiar o resto dos utilitários e middlewares, se necessário
console.log('Copying utilities and middlewares...');
fs.mkdirSync(path.join(newProjectPath, 'utils'), { recursive: true });
fs.mkdirSync(path.join(newProjectPath, 'middlewares'), { recursive: true });

// Instalar dependências adicionais, se necessário
console.log('Installing additional dependencies...');
execSync(`npm install`, { cwd: newProjectPath, stdio: 'inherit' });

console.log('Project conversion to Next.js completed. Please check the manual steps.');
