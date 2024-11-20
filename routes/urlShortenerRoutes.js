const express = require('express');
const router = express.Router();
const urlShortenerController = require('../controllers/urlShortenerController');

const ENDPOINT = '/api/shorturl';

router.post(ENDPOINT, urlShortenerController.createShortUrl);
router.get(ENDPOINT + '/:shortUrl', urlShortenerController.redirectShortUrl);

module.exports = router;
