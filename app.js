const express = require('express');
const bodyParser = require('body-parser');

const todosRoutes = require('./routes/todos-routes');
const HttpError = require('./models/http-errors');



const app = express();

app.use(bodyParser.json());

app.use('/api/todos', todosRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });

});




app.listen(4000, () => {
    console.log('listening on port 4000...');
});


