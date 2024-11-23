const express = require('express');
const router = express.Router();
const whoamiController = require('../controllers/whoamiController');

router.get('/', whoamiController.getWhoami);

module.exports = router;
