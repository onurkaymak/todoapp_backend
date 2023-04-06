const mongoose = require('mongoose');

const HttpError = require('../models/http-errors');

const Todo = require('../models/todo');
const User = require('../models/user');


const getTodosByUserId = async (req, res, next) => {
    const userId = req.params.uid;

    let userWithTodos;
    try {
        userWithTodos = await User.findById(userId).populate('todos');
    }
    catch (err) {
        const error = new HttpError('Database connection failed, could not find the user.', 500);
        return next(error);
    }

    if (!userWithTodos || userWithTodos.length === 0) {
        const error = new HttpError('Could not find any places for the provided user id.', 404)
        return next(error);
    }

    res.json({ todos: userWithTodos.todos.map(todo => todo.toObject({ getters: true })) });
};


const createTodo = async (req, res, next) => {

    const { todo, creator } = req.body;

    const createdTodo = new Todo({
        todo,
        creator
    });

    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again.', 500);
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdTodo.save({ session: sess });
        user.todos.push(createdTodo);
        await user.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError('Creating place is failed, please try again.', 500)
        return next(error);
    }


    res.status(201).json({ todo: createdTodo });

};


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




module.exports = {
    getTodosByUserId,
    createTodo,
    getTodoById
};