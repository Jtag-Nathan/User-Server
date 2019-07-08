if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};
const express = require('express');
const indexRouter = require('./routes/root');
const mongoose = require('mongoose');
const db = mongoose.connection;
const port = 3000;
const app = express();

mongoose.connect(process.env.DATABASE_URL, {
useNewUrlParser: true
});

db.on('error', error => {
    console.error(error);
});

db.once('open', () => {
    console.log('Connected to database!');
});

app.use('/', indexRouter);

app.listen(process.env.PORT || port, () => {
    console.log(`Server started and listening on port: ${port}`);
});