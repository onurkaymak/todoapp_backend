const mongoose = require('mongoose');

const HttpError = require('../models/http-errors');
const User = require('../models/user');

const createUser = async (req, res, next) => {
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

    const createdUser = new User({
        name,
        email,
        password,
        todos: []
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed, please try again. (Mongo Save)', 500)
        return next(error);
    }

    res.status(201).json({ userId: createdUser.id, email: createdUser.email });
}

module.exports = { createUser };

