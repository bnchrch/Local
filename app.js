var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var experiences = require('./routes/api/experiences');


console.log("server is now running");
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/api/experiences', experiences);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//below is some helpful code for sequalize beginers


//var Sequelize = require('sequelize')
//    , sequelize = new Sequelize('localappdb', '', '', {
//        dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
//        port:    5432, // or 5432 (for postgres)
//    });


//sequelize
//    .authenticate()
//    .complete(function(err) {
//        if (!!err) {
//            console.log('Unable to connect to the database:', err)
//        } else {
//            console.log('Connection has been established successfully.')
//        }
//    });
//
//var User = sequelize.define('User', {
//    username: Sequelize.STRING,
//    password: Sequelize.STRING,
//    email: Sequelize.STRING
//    },
//    {
//        tableName: 'Users'
//    }
//);
//
//sequelize
//    .sync({ force: true })
//    .complete(function(err) {
//        if (!!err) {
//            console.log('An error occurred while creating the table:', err)
//        } else {
//            console.log('It worked!')
//        }
//    });
//
//var user = User.build({
//    username: 'john-doe',
//    email: 'email@email.com',
//    password: 'i-am-so-great'
//});
//
//user
//    .save()
//    .complete(function(err) {
//        if (!!err) {
//            console.log('The instance has not been saved:', err)
//        } else {
//            console.log('We have a persisted instance now')
//        }
//    });
//
//
//    User
//        .find({ where: { username: 'john-doe' } })
//        .complete(function(err, johnDoe) {
//            if (!!err) {
//                console.log('An error occurred while searching for John:', err)
//            } else if (!johnDoe) {
//                console.log('No user with the username "john-doe" has been found.')
//            } else {
//                console.log('Hello ' + johnDoe.username + '!');
//                console.log('All attributes of john:', johnDoe.values);
//            }
//        });



module.exports = app;
