const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');

const HttpError = require('../models/http-errors');

const User = require('../models/user');


const signUp = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.(validation)', 422))
    }

    const { name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (err) {
        const error = new HttpError('Signing up failed, please try again later.(Mongo(findOne))', 500);
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError('User exists already, please login instead.', 422);
        return next(error);
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError('Could not create user, please try again.(bcrypt)', 500);
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        todos: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again. (Mongo Save)', 500)
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_KEY, { expiresIn: '1h' });
    }
    catch (err) {
        const error = new HttpError('Signing up failed, please try again.', 500)
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
}



const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    }
    catch (err) {
        const error = new HttpError('Login in failed, please try again later.', 500);
        return next(error);
    }

    if (!existingUser) {
        const error = new HttpError('Invalid credentials, could not log you in.', 403);
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError('Login failed, please checkyour email and password.', 500);
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError('Login failed, please checkyour email and password.', 403);
        return next(error);
    }

    let token;
    try {
        token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.JWT_KEY, { expiresIn: '1h' });
    }
    catch (err) {
        const error = new HttpError('Login failed, please try again.', 500)
        return next(error);
    }

    res.json({ userId: existingUser.id, email: existingUser.email, token });
};

module.exports = { signUp, login };

