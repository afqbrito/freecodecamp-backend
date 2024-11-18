
const { v4: uuidv4 } = require('uuid');
const users = require('../models/userModel');

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
