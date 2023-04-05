const mongoose = require('mongoose');

const HttpError = require('../models/http-errors');
const Todo = require('../models/todo');


const getTodoById = async (req, res, next) => {
    const todoId = req.params.tid;

    let todo;

    try {
        todo = await Todo.findById(todoId);
    }
    catch (err) {
        const error = new HttpError('Database connection failed, could not find the place.', 500);
        return next(error);
    }

    if (!todo) {
        const error = new HttpError('Could not find a place for the provided id.', 404);
        return next(error);
    }

    res.json({ todo: todo.toObject({ getters: true }) });
}

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
    createTodo,
    getTodoById
};