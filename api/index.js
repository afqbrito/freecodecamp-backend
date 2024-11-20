const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static('public'));

const exerciseTracker = require('../routes/exerciseTracker');
const dateRoutes = require('../routes/dateRoutes');
const whoamiRoutes = require('../routes/whoamiRoutes');
const urlShortenerRoutes = require('../routes/urlShortenerRoutes');
const fileMetadataRoutes = require('../routes/fileMetadataRoutes');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Error: ENOENT: no such file or directory, stat '/var/task/api/views/index.html'
app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
  // res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Conectar rotas
app.use(dateRoutes);
app.use(whoamiRoutes);
app.use(urlShortenerRoutes);
app.use(exerciseTracker);
app.use(fileMetadataRoutes);

// listen for requests :)
const PORT = process.env.PORT || 3000;
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
