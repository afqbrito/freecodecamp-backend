const whoamiController = require('./whoamiController');
const urlShortenerController = require('./urlShortenerController');
const exerciseTrackerController = require('./exerciseTrackerController');
const fileMetadataController = require('./fileMetadataController');

function obterOutraRota(nomeRota) {
  const outrasRotas = {
    whoami: whoamiController.getWhoami,
  };

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
