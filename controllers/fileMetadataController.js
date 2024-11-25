const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define tipos de arquivo permitidos e tamanho máximo (5 MB neste exemplo)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Cria o diretório se não existir
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Configuração do multer com filtro de tipo e tamanho de arquivo
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: function (req, file, cb) {
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

    // Metadados do arquivo
    const fileMetadata = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
    };

    // Limpeza do arquivo após processamento
    fs.unlink(req.file.path, err => {
      if (err) console.error('Erro ao remover arquivo temporário:', err);
    });

    res.json(fileMetadata);
  },
];
