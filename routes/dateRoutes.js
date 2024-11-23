const express = require('express');
const router = express.Router();
const dateController = require('../controllers/dateController');

// Rota específica para /api/date sem parâmetros
router.get('/date', (req, res) => {
  dateController.getDate(req, res);
});

// Rota para /api com parâmetro opcional
router.get('/:date', dateController.getDate);

module.exports = router;
