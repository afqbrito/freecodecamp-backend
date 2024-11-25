const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Defina o caminho de armazenamento em um local acessível
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Função para garantir que o diretório de upload exista
function ensureUploadDirExists() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    ensureUploadDirExists(); // Certifica-se de que o diretório de upload existe
    cb(null, UPLOAD_DIR);
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Configuração do multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: function (_req, file, cb) {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
    }
  },
});

exports.uploadFile = [
  upload.single('upfile'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded or invalid file type' });
    }

    const fileMetadata = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    };

    // Limpeza do arquivo após o processamento
    fs.unlink(req.file.path, err => {
      if (err) console.error('Erro ao remover arquivo temporário:', err);
    });

    res.json(fileMetadata);
  },
];
