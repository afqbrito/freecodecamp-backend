
const express = require('express');
const router = express.Router();
const fileMetadataController = require('../controllers/fileMetadataController');

router.post('/api/fileanalyse', fileMetadataController.uploadFile);

module.exports = router;
