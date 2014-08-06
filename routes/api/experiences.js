var express = require('express');
var router = express.Router();
var db = require('../../models');
var fs = require('fs');
var math  = require('mathjs');


function getLngRange () {

};

function getLatRange () {

};

router.get('/all', function(req, res) {
    db
        .Experience
        .findAll()
        .complete(function(err, experiences) {
            if(!!err) {
                console.log("An error occurred retrieving experiences:", err);
                res.send("An error occurred retrieving experiences");
            } else if (!experiences) {
                console.log("no experiences found");
                res.send("no experiences found");
            } else {
                var returnObject = {
                    experiences:experiences
                };

                res.send(JSON.stringify(returnObject));
            }
        })

});
/* GET users listing. */
router.get('/', function(req, res) {
    //insert stuff for high level experience
    var distance = req.query.distance;
    console.log(distance);

    var lat = parseFloat(req.query.lat);
    console.log(lat);

    var lng = parseFloat(req.query.lng);
    console.log(lng);

    if (!distance) {
        res.send ("need a distance");
    }

    else if (!lat) {
        res.send ("need a lat coord");
    }

    else if (!lng) {
        res.send ("need a lng coord");
    }
    else {

        /*calc range
         http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
        we need to:
        1. convert the radius given from km to lat degrees
        2. convert the radius given to lng degrees
        3. calculate lng-radius.lng, lng+radius.lng
        4. calculate lat-radius.lat, lat+radius.lat
        5. find all experiences in range
         */

        //1. convert radius into lat degrees
        var great_circle_distance = 6371; //km
        var angular_radius = distance/great_circle_distance;

        var lat_min = lat - angular_radius;
        var lat_max = lat + angular_radius;

        var delta_lng = math.asin(math.sin(angular_radius)/math.cos(lat));
        var lng_min = lng - delta_lng;
        var lng_max = lng + delta_lng;

        //TODO: dealing with poles and the 180th meridian

//        //north pole in query
//        if (lat_max > (math.pi/2)){
//            lng_min = -math.pi;
//            lat_max = math.pi/2;
//            lng_max = math.pi;
//        }
//
//        //south pole in query
//        if (lat_min < (-math.pi/2)) {
//            lat_min = -math.pi/2;
//            lng_min = -math.pi;
//            lng_max = math.pi;
//        }
//
//        //180th meridian
//        if (lng_min < -math.pi || lng_max > math.pi){
//            lng_min = -math.pi;
//            lng_max = math.pi;
//
//        }

        var sql_query = "SELECT * FROM experiences WHERE (latitude >= "
            + lat_min
            +  " AND latitude <= "
            + lat_max
            + ") AND (longitude >= "
            + lng_min
            + " AND longitude <= "
            + lng_max
            + ") AND acos(sin("
            + lat
            + ") * sin(latitude) + cos("
            + lat
            + ") * cos(latitude) * cos(longitude - ("
            + lng
            + "))) <= "
            + angular_radius;

        db
            .sequelize
            .query(sql_query)
            .success(function (local_experiences){
                    console.log(local_experiences);
                    res.json(local_experiences);

            });
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
    var lat = req.body.lat;
    var lng = req.body.lng;

    if(!username || !password || !title || !price || !rate || !description || !email || !phone_number || !lat || !lng){
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

        db
            .User
            .find({ where: { username:username, password:password } })
            .complete(function(err, user) {
                if (!!err) {
                    res.send('An error occurred while searching user:', err);
                    console.log('An error occurred while searching user:', err);
                } else if (!user) {
                    res.send('No user with those credentials exist');
                    console.log('No user with those credentials exist');
                } else {
                    // credentials given match
                    var experience = db.Experience.build({
                        title: title,
                        price: price,
                        rate: rate,
                        description: description,
                        email: email,
                        phone_number: phone_number,
                        image: '',
                        latitude: lat,
                        longitude: lng
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

router.post('/:id/upload_images', function(req, res) {

    /*
     1. check if it is an image (done in the app.js use call)
     2. check for appropriate credentials
     3. check for experience with id
     4. upload image
     5. on success write image location to experience
     */
    var username = req.body.username;
    var password = req.body.password;
    var experience_id = req.params.id;
    var image_path = req.files.image.path;
    console.log('username: ' + username + ' password: ' + password + ' id: ' + experience_id);
    console.log(req.files);
    console.log(image_path);
    //2. check credentials

    db
        .User
        .find({ where: { username: username, password: password } })
        .complete(function (err, user) {
            if (!!err) {
                console.log('An error occurred while searching user:', err);
                imageUploadFailed(res, 'An error occurred while searching user:', image_path);
            } else if (!user) {
                console.log('No user with those credentials exist');
                imageUploadFailed(res, 'No user with those credentials exist', image_path);            }
            else {
                db
                    .Experience
                    .find({ where: { id: experience_id}})
                    .complete(function (err, experience) {
                        if (!!err) {
                            console.log('An error occurred while searching experience:', err);
                            imageUploadFailed(res, 'An error occurred while searching experience:', image_path);
                        } else if (!experience) {
                            console.log('No experience matches the id');
                            imageUploadFailed(res, 'No experience matches the id', image_path);                        }
                        else {
                            if (!experience.hasUser(user)) {
                                imageUploadFailed(res, 'user does not own this experience', image_path)
                            }
                            else {
                                imageUploadSuccess(res, experience, image_path)
                            }


                        }

                    })
            }
        })
});

function imageUploadFailed (res, message, image_path) {
    fs.unlink(image_path, function (err) {
        if (err) throw err;
        console.log('successfully deleted ' + image_path);
    });
    res.send(message);
};

function imageUploadSuccess (res, experience, image_path) {
    if(experience.image) {
        fs.unlink(experience.image);
            console.log('successfully deleted ' + experience.image);
    }
    experience.image = image_path;
    experience
        .save()
        .complete(function(err){
            if (!!err) {
                console.log(err);
                imageUploadFailed(res, 'Image failed to save to database', image_path);
            }
            else res.send(200);
        });
}
module.exports = router;
