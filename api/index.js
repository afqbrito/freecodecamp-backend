const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.static('public'));

const dateRoutes = require('../routes/dateRoutes');
const whoamiRoutes = require('../routes/whoamiRoutes');
const urlShortenerRoutes = require('../routes/urlShortenerRoutes');
const exerciseTrackerRoutes = require('../routes/exerciseTrackerRoutes');
const fileMetadataRoutes = require('../routes/fileMetadataRoutes');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pathViews = path.join(__dirname, '..', 'views');

app.get('/', function (req, res) {
  res.sendFile('index.html', { root: pathViews });
});

// your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Conectar rotas
app.use(dateRoutes);
app.use(whoamiRoutes);
app.use(urlShortenerRoutes);
app.use(exerciseTrackerRoutes);
app.use(fileMetadataRoutes);

// listen for requests :)
const PORT = process.env.PORT || 3000;
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
