const express = require('express');
const router = express.Router();

const todosControllers = require('../controllers/todos-controllers');

const checkAuth = require('../middleware/check-auth');

const { createTodo, getTodoById, getTodosByUserId, updateTodo } = todosControllers;


router.get('/:uid', getTodosByUserId);

router.use(checkAuth);

router.post('/', createTodo);

router.patch('/:tid', updateTodo);




module.exports = router;