var express = require('express');
var router = express.Router();
var db = require('../../models');

router.get('/', function(req, res) {
    db
        .User
        .findAll({
            attributes: ['username']
        })
        .complete(function(err, users) {
            if(!!err) {
                console.log("An error occurred retrieving users:", err);
                res.send("An error occurred retrieving users");
            } else if (!users) {
                console.log("no users found");
                res.send("no users found");
            } else {
                res.json(users);
            }
        })
});
//
//router.get('/:id', function(req, res) {
//    db.User
//        .find({ where: { id: req.params.id } })
//        .complete(function(err, user) {
//            if (!!err) {
//                console.log('An error occurred while searching for user:', err)
//            } else if (!user) {
//                console.log('No user with the id has been found.')
//            } else {
//                console.log('Hello ' + user.username + '!');
//                console.log('All attributes of user:', user.values);
//                res.send(user.values);
//            }
//        })
//});

router.post('/', function(req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    console.log(username);
    console.log(email);

    if(!username || !email || !password){
        res.send("missing parameters!\n");
    }
    else{
        var user = db.User.build({
            username: username,
            password: password,
            email: email
        });
        user
            .save()
            .complete(function(err) {
                if (!!err) {
                    console.log('The instance has not been saved:', err);
                    res.json("an error occured while creating user: " + err.detail);
                } else {
                    console.log('We have a persisted instance now');
                    res.json(200)
                }
            });
    }

});

module.exports = router;
