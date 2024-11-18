const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Definindo rotas para usuários
router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);

module.exports = router;
