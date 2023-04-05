const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const todosRoutes = require('./routes/todos-routes');
const usersRoutes = require('./routes/users-routes');

const HttpError = require('./models/http-errors');



const app = express();

app.use(bodyParser.json());

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

mongoose.connect(`mongodb+srv://onur:gXlE1yc6KKfxbztG@cluster0.typb8ul.mongodb.net/todoApp?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Mongoose connected to database.');
        app.listen(process.env.PORT || 4000, () => {
            console.log('Listening on port 4000...');
        })
    })
    .catch(err => {
        console.log(err, 'mongo');
    })