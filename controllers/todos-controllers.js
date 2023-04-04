const mongoose = require('mongoose');

const HttpError = require('../models/http-errors');
const Todo = require('../models/todo');



const createTodo = async (req, res, next) => {

    const { todo, creator } = req.body;

    const createdTodo = new Todo({
        todo,
        creator
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTodo.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError('Creating todo is failed, please try again.', 500)
        return next(error);
    }


    res.status(201).json({ todo: createdTodo });

};

module.exports = {
    createTodo
};