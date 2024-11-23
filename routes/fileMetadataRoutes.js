const express = require('express');
const router = express.Router();
const fileMetadataController = require('../controllers/fileMetadataController');

router.post('/', fileMetadataController.uploadFile);

module.exports = router;
