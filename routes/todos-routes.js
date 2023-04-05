const express = require('express');
const router = express.Router();

const todosControllers = require('../controllers/todos-controllers');

const { createTodo, getTodoById } = todosControllers;


router.get('/:tid', getTodoById);

router.post('/', createTodo);




module.exports = router;