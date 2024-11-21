const express = require('express');
const router = express.Router();
const dateController = require('../controllers/dateController');

router.get('/api/:date?', dateController.getDate);

module.exports = router;
