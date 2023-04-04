const express = require('express');
const router = express.Router();

const todosControllers = require('../controllers/todos-controllers');
const { createTodo } = todosControllers;


// const usersControllers = require('../controllers/users-controllers');


router.post('/', createTodo);




module.exports = router;