const whoamiController = require('./whoamiController');
const urlShortenerController = require('./urlShortenerController');
const exerciseTrackerController = require('./exerciseTrackerController');
const fileMetadataController = require('./fileMetadataController');

// Função para encontrar a rota correspondente
function encontrarERetornarRota(nomeRota) {
  // Lista de padrões regex e suas descrições ou ações associadas
  const padroesComRota = [
    { pattern: /^\/api\/whoami$/, descricao: 'Whoami Route' },
    { pattern: /^\/api\/shorturl$/, descricao: 'URL Shortener Route' },
    { pattern: /^\/api\/shorturl\/\w+$/, descricao: 'Redirect Short URL Route' },
    { pattern: /^\/api\/fileanalyse$/, descricao: 'File Metadata Route' },
    { pattern: /^\/api\/users$/, descricao: 'Exercise Tracker: Create/Get Users Route' },
    { pattern: /^\/api\/users\/\w+\/exercises$/, descricao: 'Exercise Tracker: Add Exercise Route' },
    { pattern: /^\/api\/users\/\w+\/logs$/, descricao: 'Exercise Tracker: Get Exercise Logs Route' },
  ];

  // Itera sobre cada objeto que contém pattern e descrição associada
  for (let item of padroesComRota) {
    const { pattern, descricao } = item;
    // Verifica se a string nomeRota atende ao padrão atual
    if (pattern.test(nomeRota)) {
      return descricao; // Retorna a descrição associada se houver correspondência
    }
  }
  return null; // Retorna null se nenhum padrão corresponder
}

function obterOutraRota(nomeRota) {
  const outrasRotas = [{ pattern: /^\/api\/v1\/users\/\d+$/, rota: '/api/v1/users/:id' }];

  if (nomeRota && outrasRotas[nomeRota]) {
    return outrasRotas[nomeRota];
  }

  return null;
}

exports.getDate = (req, res) => {
  const dateString = req.params.date;
  let outraRota = obterOutraRota(dateString);

  if (outraRota) {
    return outraRota(req, res);
  }

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
