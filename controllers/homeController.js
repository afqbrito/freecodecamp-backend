const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Cria uma instância do aplicativo Express
const app = express();

// Configurações de middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Define o caminho para as visualizações
const pathViews = path.join(__dirname, '..', 'views');

// Rota raiz que serve uma página HTML
app.get('/', function (_req, res) {
  res.sendFile('index.html', { root: pathViews });
});

// Redirecionamento de /api/ para /api/date
app.get('/api/', function (_req, res) {
  res.redirect('/api/date');
});

// Importa e usa os roteadores de diferentes módulos
const helloRoutes = require('../routes/helloRoutes');
const whoamiRoutes = require('../routes/whoamiRoutes');
const urlShortenerRoutes = require('../routes/urlShortenerRoutes');
const exerciseTrackerRoutes = require('../routes/exerciseTrackerRoutes');
const fileMetadataRoutes = require('../routes/fileMetadataRoutes');
const dateRoutes = require('../routes/dateRoutes');

// Usa os roteadores para os diferentes caminhos da API
app.use('/api/hello', helloRoutes);
app.use('/api/whoami', whoamiRoutes);
app.use('/api/shorturl', urlShortenerRoutes);
app.use('/api/users', exerciseTrackerRoutes);
app.use('/api/fileanalyse', fileMetadataRoutes);
app.use('/api', dateRoutes);

// Exporta o aplicativo configurado
module.exports = app;
