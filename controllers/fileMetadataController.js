
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
