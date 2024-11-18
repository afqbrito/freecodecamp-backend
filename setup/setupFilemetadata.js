const fs = require('fs');
const path = require('path');

// Função para criar diretórios
function createDirectories(directories) {
  directories.forEach(dir => {
    const dirPath = path.join(__dirname, '..', dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Diretório criado: ${dirPath}`);
    }
  });
}

// Função para criar arquivos com conteúdo inicial
function createFilesWithContent(files) {
  files.forEach(file => {
    const filePath = path.join(__dirname, '..', file.path);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(`Arquivo criado: ${file.path}`);
    }
  });
}

// Diretórios a serem criados
const directories = ['/controllers', '/routes'];

// Arquivos e seus conteúdos iniciais
const files = [
  {
    path: '/controllers/fileMetadataController.js',
    content: `
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

exports.uploadFile = [
    upload.single('upfile'), // 'upfile' é o nome do campo do arquivo no formulário
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        
        const fileMetadata = {
            name: req.file.originalname,
            type: req.file.mimetype,
            size: req.file.size
        };
        
        res.json(fileMetadata);
    }
];
`,
  },
  {
    path: '/routes/fileMetadataRoutes.js',
    content: `
const express = require('express');
const router = express.Router();
const fileMetadataController = require('../controllers/fileMetadataController');

router.post('/api/fileanalyse', fileMetadataController.uploadFile);

module.exports = router;
`,
  },
];

// Criar diretórios e arquivos
createDirectories(directories);
createFilesWithContent(files);

console.log('Estrutura criada e configuração de upload de arquivo adicionada.');
