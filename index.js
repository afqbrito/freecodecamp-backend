require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const dateRoutes = require('./routes/dateRoutes');
const whoamiRoutes = require('./routes/whoamiRoutes');
const urlShortenerRoutes = require('./routes/urlShortenerRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

app.use(express.static('public'));
app.use(cors());

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Conectar rotas
app.use(dateRoutes);
app.use(whoamiRoutes);
app.use(urlShortenerRoutes);
app.use(usersRoutes);

// listen for requests :)
const PORT = process.env.PORT || 3000;
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
