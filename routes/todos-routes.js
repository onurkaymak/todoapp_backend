const express = require('express');
const router = express.Router();

const todosControllers = require('../controllers/todos-controllers');

const checkAuth = require('../middleware/check-auth');

const { createTodo, getTodoById, getTodosByUserId } = todosControllers;


router.get('/:uid', getTodosByUserId);

router.use(checkAuth);

router.post('/', createTodo);




module.exports = router;