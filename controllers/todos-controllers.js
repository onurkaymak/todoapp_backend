const mongoose = require('mongoose');

const HttpError = require('../models/http-errors');

const { validationResult } = require('express-validator');

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

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { todo } = req.body;

    const createdTodo = new Todo({
        todo,
        creator: req.userData.userId
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError('Creating todo failed, please try again.', 500);
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


const updateTodo = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const { orderedTodo } = req.body;
    const todoId = req.params.tid;

    let todo;
    try {
        todo = await Todo.findById(todoId);
    }
    catch (err) {
        const error = new HttpError('Database connection failed, could not update the todo.', 500);
        return next(error);
    }

    if (!todo) {
        const error = new HttpError('Could not find a todo with provided id.', 500);
        return next(error)
    }

    if (todo.creator.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this todo.', 401);
        return next(error);
    }

    todo.todo = orderedTodo;

    try {
        await todo.save();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not update the todo.', 500);
        return next(error);
    }

    res.status(200).json({ todo: todo.toObject({ getters: true }) });
}


const deleteTodo = async (req, res, next) => {
    const todoId = req.params.tid;

    let todo;
    try {
        todo = await Todo.findById(todoId).populate('creator');
    } catch (err) {
        const error = new HttpError('Database connection failed, could not delete this todo.', 500);
        return next(error);
    }

    if (!todo) {
        const error = new HttpError('Could not find a todo for this id.', 404);
        return next(error);
    }

    if (todo.creator.id !== req.userData.userId) {
        const error = new HttpError('You are not allowed to delete this todo.', 401);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await todo.deleteOne({ session: sess });
        todo.creator.todos.pull(todo);
        await todo.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not delete this todo.');
        return next(error)
    }

    res.status(200).json({ message: `Todo is deleted; ${todo.todo}` });
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
    updateTodo,
    deleteTodo,
    getTodoById
};