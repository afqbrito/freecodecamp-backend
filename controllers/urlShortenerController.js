
const dns = require('dns');

let urlDatabase = {};
let urlCounter = 1;

exports.createShortUrl = (req, res) => {
    const url = req.body.url;

    let hostname;
    try {
        const myURL = new URL(url);
        hostname = myURL.hostname;
    } catch (err) {
        return res.json({ error: 'invalid url' });
    }

    dns.lookup(hostname, err => {
        if (err) {
            return res.json({ error: 'invalid url' });
        }

        let shortUrl = Object.keys(urlDatabase).find(key => urlDatabase[key] === url);

        if (!shortUrl) {
            shortUrl = urlCounter++;
            urlDatabase[shortUrl] = url;
        }

        res.json({ original_url: url, short_url: shortUrl });
    });
};

exports.redirectShortUrl = (req, res) => {
    const shortUrl = req.params.shortUrl;
    const originalUrl = urlDatabase[shortUrl];

    if (originalUrl) {
        res.redirect(originalUrl);
    } else {
        res.json({ error: 'No short URL found for the given input' });
    }
};
