const { v4: uuidv4 } = require('uuid');
const exerciseTracker = require('../models/exerciseTrackerModel');

const users = exerciseTracker.users;
const exercises = exerciseTracker.exercises;

// Criar um novo usuário
exports.createUser = (req, res) => {
  const username = req.body.username;
  const _id = uuidv4();
  const newUser = { username, _id };
  users.push(newUser);
  res.json(newUser);
};

// Obter lista de todos os usuários
exports.getAllUsers = (req, res) => {
  res.json(users);
};

// Adicionar um exercício para um usuário
exports.addExercise = (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = users.find(user => user._id === _id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const exerciseDate = date ? new Date(date) : new Date();
  if (isNaN(exerciseDate.getTime())) {
    return res.json({ error: 'Invalid Date' });
  }

  const newExercise = {
    description,
    duration: Number(duration),
    date: exerciseDate.toDateString(),
    _id: user._id,
  };

  exercises.push(newExercise);

  res.json({
    _id: user._id,
    username: user.username,
    description: newExercise.description,
    duration: newExercise.duration,
    date: newExercise.date,
  });
};

// Obter o log de exercícios de um usuário
exports.getExerciseLog = (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = users.find(user => user._id === _id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  let userExercises = exercises.filter(ex => ex._id === _id);

  if (from) {
    const fromDate = new Date(from);
    if (!isNaN(fromDate.getTime())) {
      userExercises = userExercises.filter(ex => new Date(ex.date) >= fromDate);
    }
  }

  if (to) {
    const toDate = new Date(to);
    if (!isNaN(toDate.getTime())) {
      userExercises = userExercises.filter(ex => new Date(ex.date) <= toDate);
    }
  }

  if (limit) {
    userExercises = userExercises.slice(0, Number(limit));
  }

  const log = userExercises.map(ex => ({
    description: ex.description,
    duration: ex.duration,
    date: ex.date,
  }));

  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log: log,
  });
};
