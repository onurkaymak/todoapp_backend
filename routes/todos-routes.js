const express = require('express');
const router = express.Router();

const todosControllers = require('../controllers/todos-controllers');
const { getTodos } = todosControllers;


// const usersControllers = require('../controllers/users-controllers');


router.get('/', getTodos);




module.exports = router;