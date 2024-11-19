const fs = require('fs');
const path = require('path');

const sourceDir = '/workspaces/freecodecamp-backend';
const targetDir = '/workspaces/freecodecamp-novo';

const directoriesToCopy = [
  { src: 'controllers', dest: 'src/controllers' },
  { src: 'models', dest: 'src/models' },
  { src: 'routes', dest: 'src/routes' },
  { src: 'middlewares', dest: 'src/middlewares' },
  { src: 'utils', dest: 'src/utils' },
  { src: 'views', dest: 'src/views' },
  { src: 'config', dest: 'src/config' },
  { src: 'public', dest: 'public' },
  { src: '.vscode', dest: '.vscode' },
];

function copyFileSync(source, target) {
  const targetFile =
    fs.existsSync(target) && fs.lstatSync(target).isDirectory() ? path.join(target, path.basename(source)) : target;
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const curSource = path.join(source, file);
    if (fs.lstatSync(curSource).isDirectory()) {
      const targetFolder = path.join(target, path.basename(curSource));
      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
      }
      copyFolderRecursiveSync(curSource, targetFolder);
    } else {
      copyFileSync(curSource, target);
    }
  });
}

function createProjectStructure() {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  directoriesToCopy.forEach(dir => {
    const srcPath = path.join(sourceDir, dir.src);
    const destPath = path.join(targetDir, dir.dest);
    if (fs.existsSync(srcPath)) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFolderRecursiveSync(srcPath, destPath);
    }
  });

  // Copy and rename files in the root directory
  ['package.json', 'package-lock.json', 'README.md', '.env.development', '.env.production', 'index.js'].forEach(
    file => {
      const srcFile = path.join(sourceDir, file);
      const destFile = path.join(targetDir, file);
      if (fs.existsSync(srcFile)) {
        copyFileSync(srcFile, destFile);
      }
    }
  );
}

createProjectStructure();
console.log('Projeto convertido com sucesso para /workspaces/freecodecamp-novo/');
