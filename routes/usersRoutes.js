const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

const ENDPOINT = '/api/users';

router.post(ENDPOINT, usersController.createUser);
router.get(ENDPOINT, usersController.getAllUsers);

router.post(ENDPOINT + '/:_id/exercises', usersController.addExercise);
router.get(ENDPOINT + '/:_id/logs', usersController.getExerciseLog);

module.exports = router;
