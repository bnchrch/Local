//var express = require('express');
//var router = express.Router();
//var db = require('../models');
//var passport = require('passport')
//    , FacebookStrategy = require('passport-facebook').Strategy;
//
//passport.use(new FacebookStrategy({
//        clientID: '678994002189613',
//        clientSecret: '5ad94192b6d4fa9d61a955cb68ad9257',
//        callbackURL: "http://localhost:3000/auth/facebook/callback"
//    },
//    function(accessToken, refreshToken, profile, done) {
//        db
//            .User
//            .findOrCreate({}, function(err, user) {
//                if (err) { return done(err); }
//                done(null, user);
//            });
//    }
//));
//
//router.get('/facebook', passport.authenticate('facebook'));
//
//router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }),
//    function(req, res) {
//        res.redirect('/');
//    });
//
//module.exports = router;