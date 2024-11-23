const express = require('express');
const router = express.Router();
const usersController = require('../controllers/exerciseTrackerController');

router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);

router.post('/:_id/exercises', usersController.addExercise);
router.get('/:_id/logs', usersController.getExerciseLog);

module.exports = router;
