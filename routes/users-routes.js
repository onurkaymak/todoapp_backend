const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users-controllers');

const { signUp, login } = usersControllers;



router.post('/signup', signUp);

router.post('/login', login);




module.exports = router;