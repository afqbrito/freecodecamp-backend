
const express = require('express');
const router = express.Router();
const dateController = require('../controllers/dateController');

router.get('/api/data/:date?', dateController.getDate);

module.exports = router;
