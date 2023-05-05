require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const todosRoutes = require('./routes/todos-routes');
const usersRoutes = require('./routes/users-routes');

const HttpError = require('./models/http-errors');

const app = express();

app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*',);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


app.use('/api/todos', todosRoutes);

app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });

});

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.typb8ul.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Mongoose connected to database.');
        app.listen(process.env.PORT || 4000, () => {
            console.log('Listening on port 4000...');
        })
    })
    .catch(err => {
        console.log(err, 'mongo');
    })