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
    path: '/controllers/dateController.js',
    content: `
exports.getDate = (req, res) => {
    const dateString = req.params.date;
    let date;

    if (!dateString) {
        date = new Date();
    } else {
        if (!isNaN(dateString)) {
            date = new Date(parseInt(dateString));
        } else {
            date = new Date(dateString);
        }
    }

    if (isNaN(date.getTime())) {
        return res.json({ error: 'Invalid Date' });
    }

    const unixTimestamp = date.getTime();
    const utcString = date.toUTCString();
    res.json({ unix: unixTimestamp, utc: utcString });
};
`,
  },
  {
    path: '/controllers/whoamiController.js',
    content: `
exports.getWhoami = (req, res) => {
    const ipaddress = req.ip || req.socket.remoteAddress;
    const language = req.headers['accept-language'];
    const software = req.headers['user-agent'];

    res.json({
        ipaddress: ipaddress,
        language: language,
        software: software,
    });
};
`,
  },
  {
    path: '/controllers/urlShortenerController.js',
    content: `
const dns = require('dns');

let urlDatabase = {};
let urlCounter = 1;

exports.createShortUrl = (req, res) => {
    const url = req.body.url;

    let hostname;
    try {
        const myURL = new URL(url);
        hostname = myURL.hostname;
    } catch (err) {
        return res.json({ error: 'invalid url' });
    }

    dns.lookup(hostname, err => {
        if (err) {
            return res.json({ error: 'invalid url' });
        }

        let shortUrl = Object.keys(urlDatabase).find(key => urlDatabase[key] === url);

        if (!shortUrl) {
            shortUrl = urlCounter++;
            urlDatabase[shortUrl] = url;
        }

        res.json({ original_url: url, short_url: shortUrl });
    });
};

exports.redirectShortUrl = (req, res) => {
    const shortUrl = req.params.shortUrl;
    const originalUrl = urlDatabase[shortUrl];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.json({ error: 'No short URL found for the given input' });
    }
};
`,
  },
  {
    path: '/routes/dateRoutes.js',
    content: `
const express = require('express');
const router = express.Router();
const dateController = require('../controllers/dateController');

router.get('/api/data/:date?', dateController.getDate);

module.exports = router;
`,
  },
  {
    path: '/routes/whoamiRoutes.js',
    content: `
const express = require('express');
const router = express.Router();
const whoamiController = require('../controllers/whoamiController');

router.get('/api/whoami', whoamiController.getWhoami);

module.exports = router;
`,
  },
  {
    path: '/routes/urlShortenerRoutes.js',
    content: `
const express = require('express');
const router = express.Router();
const urlShortenerController = require('../controllers/urlShortenerController');

router.post('/api/shorturl', urlShortenerController.createShortUrl);
router.get('/api/shorturl/:shortUrl', urlShortenerController.redirectShortUrl);

module.exports = router;
`,
  },
];

// Criar diretórios e arquivos
createDirectories(directories);
createFilesWithContent(files);

console.log('Estrutura criada e código reorganizado.');
