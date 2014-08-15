var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');

var routes = require('./routes/index');
var api_users = require('./routes/api/users');
var api_experiences = require('./routes/api/experiences');
var auth = require('./routes/auth');

var crypto = require('crypto');

console.log("server is now running");
var app = express();

app.use(express.static(path.join(__dirname, '/public')));
console.log(__dirname);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());


function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
}

app.use(multer({
    dest:'./public/images',
    onFileUploadStart: function (file) {
        var accepted_fieldnames = ["image0", "image1", "image2", "image3", "image4", "image5", "username", "password"];
        if (file.mimetype != 'image/png' && file.mimetype != 'image/jpeg') {
            console.log("rejected file upload because of mimetype: " +file.mimetype);
            return false;
        }
        console.log("index: " + accepted_fieldnames.indexOf(file.fieldname));
        if (accepted_fieldnames.indexOf(file.fieldname)=== -1) {
            console.log("rejected because tags did not match");
            return false;
        }
    },
    rename: function (fieldname, filename) {
        return randomValueHex(8) + Date.now()
    },
    limits: {
        fieldNameSize: 100,
        files: 5
    }
}));




//routes
app.use('/', routes);
app.use('/api/users', api_users);
app.use('/api/experiences', api_experiences);
//app.use('/auth', auth);

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


module.exports = app;
