const express = require('express');

const router = express.Router();

const { check } = require('express-validator');

const todosControllers = require('../controllers/todos-controllers');

const checkAuth = require('../middleware/check-auth');

const { createTodo, getTodoById, getTodosByUserId, updateTodo, deleteTodo } = todosControllers;


router.get('/:uid', getTodosByUserId);

router.use(checkAuth);

router.post('/', [
    check('todo').not().isEmpty(),
], createTodo);

router.patch('/:tid', [
    check('updatedTodo').not().isEmpty(),
], updateTodo);

router.delete('/:tid', deleteTodo);




module.exports = router;