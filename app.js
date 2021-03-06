var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validator = require('express-validator');

var index = require('./routes/index');
var app = express();
var MongoStore = require('connect-mongo')(session);
// mongoose.connect('localhost:27017/ecomm');

mongoose.connect('mongodb://karthik:iamkr@ds060009.mlab.com:60009/ecomm');
require('./config/passport');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: 'this is a very secter message',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static("public"));
app.use('/details', express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {

    app.locals.session = req.session;
    app.locals.logi = req.isAuthenticated();
    app.locals.username = false;
    if (req.user) {

        app.locals.username = req.user.email;
    }
    // console.log(req.user);
    next();
});


app.use('/', index);

// var username = req.session.user && req.session.user.username ? req.session.user.username : null;

// res.render('index', { title: 'My title', username: username });
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;