const whoamiController = require('./whoamiController');

const outrasRotas = {
  whoami: whoamiController.getWhoami,
};

exports.getDate = (req, res) => {
  const dateString = req.params.date;
  let date;

  if (dateString && outrasRotas[dateString]) {
    return outrasRotas[dateString](req, res);
  }

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
