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
    return res.json({ error: `Invalid Date: '${dateString}'` });
  }

  const unixTimestamp = date.getTime();
  const utcString = date.toUTCString();
  res.json({ unix: unixTimestamp, utc: utcString });
};
