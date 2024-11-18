require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const dns = require('dns');

const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static('public'));

// Middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint...
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Rota para /api/:date?
app.get('/api/data/:date?', (req, res) => {
  const dateString = req.params.date;
  let date;

  // Se não houver parâmetro de data, usar a data atual
  if (!dateString) {
    date = new Date();
  } else {
    // Verificar se a data é um timestamp Unix
    if (!isNaN(dateString)) {
      date = new Date(parseInt(dateString));
    } else {
      date = new Date(dateString);
    }
  }

  // Verificar se a data é válida
  if (isNaN(date.getTime())) {
    return res.json({ error: 'Invalid Date' });
  }

  const unixTimestamp = date.getTime();
  const utcString = date.toUTCString();
  res.json({ unix: unixTimestamp, utc: utcString });
});

// Rota para /api/whoami
app.get('/api/whoami', (req, res) => {
  // Obter o endereço IP do cliente usando req.socket
  const ipaddress = req.ip || req.socket.remoteAddress;

  // Obter o idioma preferido do cabeçalho Accept-Language
  const language = req.headers['accept-language'];

  // Obter o software (User-Agent) do cabeçalho User-Agent
  const software = req.headers['user-agent'];

  // Retornar as informações em um objeto JSON
  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software,
  });
});

// In-memory storage for URLs
const urlDatabase = {};
let urlCounter = 1;

// Endpoint to create a short URL
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  // Validate URL using WHATWG URL API
  let hostname;
  try {
    const myURL = new URL(url);
    hostname = myURL.hostname;
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  // Check if the URL is valid using DNS
  dns.lookup(hostname, err => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    // Check if the URL is already stored
    let shortUrl = Object.keys(urlDatabase).find(key => urlDatabase[key] === url);

    // If URL is not already stored, add it
    if (!shortUrl) {
      shortUrl = urlCounter++;
      urlDatabase[shortUrl] = url;
    }

    // Respond with JSON containing the original and short URL
    res.json({ original_url: url, short_url: shortUrl });
  });
});

// Endpoint to redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlDatabase[shortUrl];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No short URL found for the given input' });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
