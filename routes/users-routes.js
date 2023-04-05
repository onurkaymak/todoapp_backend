const express = require('express');
const router = express.Router();

const usersControllers = require('../controllers/users-controllers');

const { createUser } = usersControllers;



router.post('/', createUser);




module.exports = router;