var express = require('express');
var router = express.Router();
var db = require('../../models');

/* GET users listing. */
router.get('/', function(req, res) {
    //insert stuff for high level experience
    radius = req.query.radius;
    console.log(radius);

    lat = req.query.lat;
    console.log(lat);

    lng = req.query.lng;
    console.log(lng);

    if (!radius) {
        res.send ("need a radius");
    }

    else if (!lat) {
        res.send ("need a lat coord");
    }

    else if (!lng) {
        res.send ("need a lng coord");
    }
    else {
        db
            .Experience
            .findAll()
            .complete(function(err, experiences) {
                if(!!err) {
                    console.log("An error occurred retrieving users:", err);
                    res.send("An error occurred retrieving users");
                } else if (!experiences) {
                    console.log("no experiences found");
                    res.send("no no experiences found");
                } else {
                    res.json(experiences);
                }
            })

    }



});

router.get('/:id', function(req, res) {
    db.Experience
        .find({ where: { id: req.params.id } })
        .complete(function(err, experience) {
            if (!!err) {
                console.log('An error occurred while searching for experience:', err)
            } else if (!experience) {
                console.log('No experience with the id has been found.')
            } else {
                res.json(experience.values);
            }
        })
});

router.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var title = req.body.title;
    var price = req.body.price;
    var rate = req.body.rate;
    var description = req.body.description;
    var email = req.body.email;
    var phone_number = req.body.phone_number;


    if(!username || !password || !title || !price || !rate || !description || !email || !phone_number){
        res.send("missing parameters!\n");
    }
//    else if (rate !== 'hour'
//        || rate != 'day'
//        ||  rate != 'week'
//        ||  rate != 'month' ) {
//        res.send('Your rate must be per hour, day, week, or month');
//
//    }
    else{

        db.
            User
            .find({ where: { username: username, password:password } })
            .complete(function(err, user) {
                if (!!err) {
                    console.log('An error occurred while searching user:', err)
                } else if (!user) {
                    console.log('No user with those credentials exist')
                } else {
                    // credentials given match
                    var experience = db.Experience.build({
                        title: title,
                        price: price,
                        rate: rate,
                        description: description,
                        email: email,
                        phone_number: phone_number
                    });
                    experience
                        .save()
                        .complete(function(err, experience) {
                            if (!!err) {
                                console.log('The instance has not been saved:', err);
                                res.send(500);
                            } else {
                                console.log('We have a persisted instance now');
                                experience
                                    .setUser(user)
                                    .complete(function(err){
                                       if(!!err){
                                           console.log("failed to associate experience with user");
                                       } else {
                                           console.log("associated successfully!")
                                       }
                                    });
                                res.send(200)
                            }
                        });
                }
            })



    }

});


module.exports = router;
