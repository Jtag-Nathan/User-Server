if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};
const express = require('express');
const logger = require('morgan');
const indexRouter = require('./routes/root');
const usersRouter = require('./routes/users');
const mongoose = require('mongoose');
const cors = require('cors');
//mongoose.set('useCreateIndex', true); //Use it here or include it as args in the connect as below either works
const bodyParser = require('body-parser');
const db = mongoose.connection;
const port = 3000;
var jwt = require('jsonwebtoken');
const app = express();
app.set('secretKey', process.env.JWT_KEY);

mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true, useCreateIndex: true
});

db.on('error', error => {
    console.error(error);
});

db.once('open', () => {
    console.log('Connected to database!');
});

app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
//handle 404 error
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});
//handle errors
app.use((err, req, res, next) => {
    console.log(err);

    if(err.status === 404)
     res.status(404).json({message: "Not Found"});
    else
     res.status(500).json({message: "Something looks wrong! :("});
});

app.listen(process.env.PORT || port, () => {
    console.log(`Server started and listening on port: ${port}`);
});