const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use('/public', express.static(process.cwd() + '/public'));

const exerciseTracker = require('./src/routes/exerciseTracker');
const dateRoutes = require('./src/routes/dateRoutes');
const whoamiRoutes = require('./src/routes/whoamiRoutes');
const urlShortenerRoutes = require('./src/routes/urlShortenerRoutes');
const fileMetadataRoutes = require('./src/routes/fileMetadataRoutes');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/src/views/index.html');
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
