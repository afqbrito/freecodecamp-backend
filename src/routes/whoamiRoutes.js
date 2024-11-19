
const express = require('express');
const router = express.Router();
const whoamiController = require('../controllers/whoamiController');

router.get('/api/whoami', whoamiController.getWhoami);

module.exports = router;
