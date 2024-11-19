const fs = require('fs');
const path = require('path');

// Função para criar diretórios
function createDirectories(basePath, directories) {
  directories.forEach(dir => {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Diretório criado: ${dirPath}`);
    }
  });
}

// Função para criar arquivos com conteúdo inicial
function createFilesWithContent(basePath, files) {
  files.forEach(file => {
    const filePath = path.join(basePath, file.path);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(`Arquivo criado: ${filePath}`);
    }
  });
}

// Caminho base para o diretório raiz do projeto
const basePath = path.join(__dirname, '..');

// Diretórios a serem criados
const directories = ['/controllers', '/models', '/routes'];

// Arquivos e seus conteúdos iniciais
const files = [
  {
    path: '/controllers/usersController.js',
    content: `
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
`,
  },
  {
    path: '/controllers/exercisesController.js',
    content: `
const users = require('../models/userModel');
const exercises = require('../models/exerciseModel');

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
        username: user.username,
        description,
        duration: Number(duration),
        date: exerciseDate.toDateString(),
        _id: user._id
    };

    exercises.push(newExercise);
    res.json(newExercise);
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
        date: ex.date
    }));

    res.json({
        username: user.username,
        count: log.length,
        _id: user._id,
        log: log
    });
};
`,
  },
  {
    path: '/models/userModel.js',
    content: `
// Simulação de banco de dados na memória para usuários
const users = [];

module.exports = users;
`,
  },
  {
    path: '/models/exerciseModel.js',
    content: `
// Simulação de banco de dados na memória para exercícios
const exercises = [];

module.exports = exercises;
`,
  },
  {
    path: '/routes/usersRoutes.js',
    content: `
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Definindo rotas para usuários
router.post('/', usersController.createUser);
router.get('/', usersController.getAllUsers);

module.exports = router;
`,
  },
  {
    path: '/routes/exercisesRoutes.js',
    content: `
const express = require('express');
const router = express.Router();
const exercisesController = require('../controllers/exercisesController');

// Definindo rotas para exercícios
router.post('/:_id/exercises', exercisesController.addExercise);
router.get('/:_id/logs', exercisesController.getExerciseLog);

module.exports = router;
`,
  },
  {
    path: '/index.js',
    content: `
const express = require('express');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/usersRoutes');
const exercisesRoutes = require('./routes/exercisesRoutes');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conectar rotas
app.use('/api/users', usersRoutes);
app.use('/api/users', exercisesRoutes);

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Servidor rodando na porta \${PORT}\`);
});
`,
  },
];

// Criar diretórios e arquivos
createDirectories(basePath, directories);
createFilesWithContent(basePath, files);
