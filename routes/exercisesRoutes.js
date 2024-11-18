const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

// Adicionar um exercício para um usuário
router.post('/:_id/exercises', exercisesController.addExercise);

// Obter o log de exercícios de um usuário
router.get('/:_id/logs', exercisesController.getExerciseLog);

module.exports = router;
