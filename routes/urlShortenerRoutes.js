const express = require('express');
const router = express.Router();
const urlShortenerController = require('../controllers/urlShortenerController');

router.post('/', urlShortenerController.createShortUrl);
router.get('/:shortUrl', urlShortenerController.redirectShortUrl);

module.exports = router;
