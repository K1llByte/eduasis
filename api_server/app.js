const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
//const jwt = require('jsonwebtoken');
//const methodOverride = require('method-override');


// Set up default mongoose connection
const MONGODB_URL = 'mongodb://127.0.0.1/eduasis';
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error...'));
db.once('open', function() {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

const index_router = require('./routes/index');
const users_router = require('./routes/users');
const resources_router = require('./routes/resources');
const posts_router = require('./routes/posts');

var app = express();


//app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false,parameterLimit: 1000000 }));
app.use('/storage',express.static(path.join(__dirname, 'storage')));

//parse application/json


// Routes
app.use('/', index_router);
app.use('/', users_router);
app.use('/', resources_router);
app.use('/', posts_router);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.json({ "error" : err.message });
});

module.exports = app;
