var express = require('express');
var router = express.Router();
var db = require('../../models');
var fs = require('fs');
var math  = require('mathjs');
var validator = require('validator');
var geocoderProvider = 'google';
var httpAdapter = 'http';
var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);

//should work
router.get('/all', function(req, res) {
    db
        .Secret
        .findAll()
        .complete(function(err, secrets) {
            if(!!err) {
                console.log("An error occurred retrieving secrets:", err);
                res.send("An error occurred retrieving secrets");
            } else if (!secrets) {
                console.log("no secrets found");
                res.send("no secrets found");
            } else {
                res.set('Content-Type', 'application/json');
                var returnObject = {
                    secrets:secrets
                };

                res.send(JSON.stringify(returnObject));
            }
        })

});

//should work
/* GET users listing. */
router.get('/', function(req, res) {
    //insert stuff for high level secret

    if (!req.query.distance || !validator.isFloat(req.query.distance)) {
        res.json ("need a distance");
    }

    else if (!req.query.lat || !validator.isFloat(req.query.lat)) {
        res.json ("need a lat coord");
    }

    else if (!req.query.lng || !validator.isFloat(req.query.lng)) {
        res.json ("need a lng coord");
    }
    else {
        var distance = validator.escape(req.query.distance);
        console.log(distance);

        var lat = validator.escape(parseFloat(req.query.lat));
        console.log(lat);

        var lng = validator.escape(parseFloat(req.query.lng));
        console.log(lng);

        /*calc range
         http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
         we need to:
         1. convert the radius given from km to lat degrees
         2. convert the radius given to lng degrees
         3. calculate lng-radius.lng, lng+radius.lng
         4. calculate lat-radius.lat, lat+radius.lat
         5. find all secrets in range
         */

        //1. convert radius into lat degrees

        //convert lat, lng from degrees to radians
        lat = lat * math.pi / 180;
        lng = lng * math.pi / 180;

        var great_circle_distance = 6371; //km
        var angular_radius = distance/great_circle_distance;

        var lat_min = lat - angular_radius;
        var lat_max = lat + angular_radius;

        var delta_lng = math.asin(math.sin(angular_radius)/math.cos(lat));
        var lng_min = lng - delta_lng;
        var lng_max = lng + delta_lng;

        //TODO: dealing with poles and the 180th meridian

        //north pole in query
        if (lat_max > (math.pi/2)){
            lng_min = -math.pi;
            lat_max = math.pi/2;
            lng_max = math.pi;
        }

        //south pole in query
        if (lat_min < (-math.pi/2)) {
            lat_min = -math.pi/2;
            lng_min = -math.pi;
            lng_max = math.pi;
        }

        //180th meridian
        if (lng_min < -math.pi || lng_max > math.pi){
            lng_min = -math.pi;
            lng_max = math.pi;

        }
        console.log("lat min: " + lat_min + "lat max: " + lat_max + "lng min: " + lng_min + "lng max: " + lng_max);

        var sql_query = "SELECT * FROM secrets WHERE is_active AND (radians(latitude) >= "
            + lat_min
            +  " AND radians(latitude) <= "
            + lat_max
            + ") AND (radians(longitude) >= "
            + lng_min
            + " AND radians(longitude) <= "
            + lng_max
            + ") AND acos(sin("
            + lat
            + ") * sin(radians(latitude)) + cos("
            + lat
            + ") * cos(radians(latitude)) * cos(radians(longitude) - ("
            + lng
            + "))) <= "
            + angular_radius;

        db
            .sequelize
            .query(sql_query)
            .success(function (local_secrets){
                res.set('Content-Type', 'application/json');
                var returnObject = {
                    secrets:local_secrets
                };

                res.send(JSON.stringify(returnObject));

            });
    }



});

//should work
router.get('/:id', function(req, res) {
    db.Secret
        .find({ where: { id: req.params.id } })
        .complete(function(err, secret) {
            if (!!err) {
                console.log('An error occurred while searching for secret:', err)
            } else if (!secret) {
                console.log('No secret with the id has been found.')
            } else {
                res.set('Content-Type', 'application/json');
                res.json(secret.values);
            }
        })
});

/*
Questions that need to be answered before live!!!:
1. are we gonna allow people to add from anywhere? YES
2. do they have to be there? NO
3. address vs lat/lng?
4. how do users choose the location?

 */
router.post('/', function(req, res) {
    var username = req.body.username;
    var password = req.body.password;

    var title = req.body.title;
    var description = req.body.description;
    var address = req.body.address;

    if(!username || !password || !title || !description || !address){
        res.json("missing parameters!");
    }

    else{
        geocoder.geocode(address, function(err, geoData) {
            if (0) {
                res.json("error occured when looking up address");
                console.log("error occured when looking up address: " + err);
            }
            else {
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
                            var secret = db.Secret.build({
                                title: title,
                                description: description,
                                latitude: geoData[0].latitude,
                                longitude: geoData[0].longitude,
                                street_name: geoData[0].streetName,
                                street_number: geoData[0].streetNumber,
                                zipcode: geoData[0].zipcode,
                                state: geoData[0].state,
                                city: geoData[0].city,
                                country: geoData[0].country
                            });
                            secret
                                .save()
                                .complete(function(err, secret) {
                                    if (!!err) {
                                        console.log('The instance has not been saved:', err);
                                        res.json(err.detail);
                                    } else {
                                        console.log('We have a persisted instance now');
                                        secret
                                            .setUser(user)
                                            .complete(function(err){
                                                if(!!err){
                                                    console.log("failed to associate secret with user" + err);
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

    }

});

router.put('/:id', function(req, res) {
    var secret_id = req.params.id;

    var username = req.body.username;
    var password = req.body.password;

    var title = req.body.title;
    var description = req.body.description;

    //let a user specify a new address by the actual address or coords
    var address = req.body.address;

    //other set
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    var submittedAddress = false;

    if (address) {
        submittedAddress = true;
    }
    else if (latitude && longitude) submittedAddress = true;

    if(!username || !password || !title || !description || !submittedAddress){
        res.json("missing parameters!");
    }

    //all needed values present
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
                    // user credentials given match
                    db
                        .Secret
                        .find({ where: { id: secret_id}})
                        .complete(function (err, secret) {
                            if (!!err) {
                                console.log('An error occurred while searching secret:', err);
                                res.json('An error occurred while searching secret');
                            } else if (!secret) {
                                console.log('No secret matches the id');
                                res.json('No secret matches the id');
                            }
                            else {
                                if (!secret.hasUser(user)) {
                                    res.json('user does not own this secret')
                                }
                                else {
                                    //secret exists, user exists, user owns secret
                                    secret.title = title;
                                    secret.description = description;

                                    if (address){
                                        //get the address from google
                                        geocoder.geocode(address, function(err, geoData) {
                                            if (!!err) {
                                                res.json("error occured when looking up address");
                                                console.log("error occured when looking up address: " + err);
                                            }
                                            else {
                                                //update the address with the geocoded stuff

                                                secret.latitude =  geoData[0].latitude;
                                                secret.longitude = geoData[0].longitude;
                                                secret.street_name = geoData[0].streetName;
                                                secret.street_number = geoData[0].streetNumber;
                                                secret.zipcode = geoData[0].zipcode;
                                                secret.state = geoData[0].state;
                                                secret.city = geoData[0].city;
                                                secret.country = geoData[0].country;
                                                secret
                                                    .save()
                                                    .complete(function(err){
                                                        if (!!err) {
                                                            console.log(err);
                                                            res.json('failed to update the secret');
                                                        }
                                                        else {
                                                            res.send(200);
                                                        }
                                                    });

                                            }
                                        })
                                    }
                                    else {
                                        //update lat lng
                                        secret.latitude = latitude;
                                        secret.longitude = longitude;
                                        secret
                                            .save()
                                            .complete(function(err){
                                                if (!!err) {
                                                    console.log(err);
                                                    res.json('failed to update the secret');
                                                }
                                                else {
                                                    res.send(200);
                                                }
                                            });
                                    }

                                }
                            }
                        });


                }
            })


    };

});

//should work
router.delete('/:id', function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var secret_id = req.params.id;


        console.log(username + " " + password);
        db
            .User
            .find({ where: { username: username, password: password } })
            .complete(function (err, user) {
                if (!!err) {
                    console.log('An error occurred while searching user:', err);
                    res.json('An error occurred while searching user');
                } else if (!user) {
                    console.log('No user with those credentials exist', err);
                    res.json('No user with those credentials exist');
                }
                else {
                    db
                        .Secret
                        .find({ where: { id: secret_id}})
                        .complete(function (err, secret) {
                            if (!!err) {
                                console.log('An error occurred while searching secret:', err);
                                res.json('An error occurred while searching secret');
                            } else if (!secret) {
                                console.log('No secret matches the id');
                                res.json('No secret matches the id');
                            }
                            else {
                                if (!secret.hasUser(user)) {
                                    res.json('user does not own this secret')
                                }
                                else {
                                    secret
                                        .destroy()
                                        .complete(function(err){
                                            if(!!err) {
                                                console.log(err);
                                                res.json('secret failed to delete from database');
                                            }
                                            else {
                                                res.send(200);
                                            }
                                        })
                                }


                            }

                        })
                }
            })
    }
);

function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

//should work
function deleteImage(res, secret, image_label) {
    var public_dir = 'public';
    var path_to_unlink;
    var accepted_fieldnames = ["image0", "image1", "image2", "image3", "image4", "image5"];

    switch(accepted_fieldnames.indexOf(image_label)) {

        case 0:
            //image0
            if(secret.image0) {

                path_to_unlink = public_dir + secret.image0;
                secret.image0 = null;
            }
            break;

        case 1:
            //image1
            if(secret.image1) {
                path_to_unlink = public_dir + secret.image1;
                secret.image1 = null;

            }
            break;

        case 2:
            //image2
            if(secret.image2) {
                path_to_unlink = public_dir + secret.image2;
                secret.image2 = null;

            }
            break;

        case 3:
            //image3
            if(secret.image3) {
                path_to_unlink = public_dir + secret.image3;
                secret.image3 = null;

            }
            break;

        case 4:
            //image4
            if(secret.image4) {
                path_to_unlink = public_dir + secret.image4;
                secret.image4 = null;
            }
            break;

        case 5:
            //image5
            if(secret.image5) {
                path_to_unlink = public_dir + secret.image5;
                secret.image5 = null;
            }
            break;

        default:
            console.log("hit default during delete: " + image_label);

    }
    if (secret.image0) {
        secret.is_active = true;
    }
    else {
        secret.is_active = false;
    }
    //todo: need error catching if this fails

    secret
        .save()
        .complete(function(err){
            if (!!err) {
                console.log(err);
                res.json('Image failed to delete from database');
            }
            else {
                if (path_to_unlink) {
                    fs.unlink(path_to_unlink);
                    console.log('successfully deleted ' + path_to_unlink);
                    res.send(200);

                }
                else res.json('no image to delete');
            }
        });


}

//should work
router.delete('/:id/image/:image_label', function(req, res) {
        var username = req.body.username;
        var password = req.body.password;
        var secret_id = req.params.id;
        var image_label = req.params.image_label;

        console.log(username + " " + password);
        db
            .User
            .find({ where: { username: username, password: password } })
            .complete(function (err, user) {
                if (!!err) {
                    console.log('An error occurred while searching user:', err);
                    res.json('An error occurred while searching user');
                } else if (!user) {
                    console.log('No user with those credentials exist');
                    res.json('No user with those credentials exist');
                }
                else {
                    db
                        .Secret
                        .find({ where: { id: secret_id}})
                        .complete(function (err, secret) {
                            if (!!err) {
                                console.log('An error occurred while searching secret:', err);
                                res.json('An error occurred while searching secret');
                            } else if (!secret) {
                                console.log('No secret matches the id');
                                res.json('No secret matches the id');
                            }
                            else {
                                if (!secret.hasUser(user)) {
                                    res.json('user does not own this secret')
                                }
                                else {
                                    deleteImage(res, secret, image_label)
                                }


                            }

                        })
                }
            })
    }
);

//should work
router.post('/:id/upload_images', function(req, res) {

    /*
     1. check if it is an image (done in the app.js use call)
     2. check for appropriate credentials
     3. check for secret with id
     4. upload image
     5. on success write image location to secret
     */
    if (isEmptyObject(req.files)) {
        console.log("500 bitch, no files");
        res.send(500);

    }
    else {

        var username = req.body.username;
        var password = req.body.password;
        var secret_id = req.params.id;
        //var image_path = req.files;
        console.log('username: ' + username + ' password: ' + password + ' id: ' + secret_id);
        console.log(req.files);
        //2. check credentials

        db
            .User
            .find({ where: { username: username, password: password } })
            .complete(function (err, user) {
                if (!!err) {
                    console.log('An error occurred while searching user:', err);
                    imageUploadFailed(res, 'An error occurred while searching user:', req.files);
                } else if (!user) {
                    console.log('No user with those credentials exist');
                    imageUploadFailed(res, 'No user with those credentials exist', req.files);
                }
                else {
                    db
                        .Secret
                        .find({ where: { id: secret_id}})
                        .complete(function (err, secret) {
                            if (!!err) {
                                console.log('An error occurred while searching secret:', err);
                                imageUploadFailed(res, 'An error occurred while searching secret:', req.files);
                            } else if (!secret) {
                                console.log('No secret matches the id');
                                imageUploadFailed(res, 'No secret matches the id', req.files);
                            }
                            else {
                                if (!secret.hasUser(user)) {
                                    imageUploadFailed(res, 'user does not own this secret', req.files)
                                }
                                else {
                                    imageUploadSuccess(res, secret, req.files)
                                }


                            }

                        })
                }
            })
    }
});

function imageUploadFailed (res, message, image_path) {

    for (var i = 0; i < image_path.length; i++) {

        fs.unlink(image_path[i].path, function (err) {
            if (err) throw err;
            console.log('successfully deleted ' + image_path[i]);
        });
    }

    res.send(message);
}

//should work
function imageUploadSuccess (res, secret, files) {
    var public_dir = 'public';
    var accepted_fieldnames = ["image0", "image1", "image2", "image3", "image4", "image5"];
    console.log(files);
    for (i in files)
    {
        console.log("switching");
        switch(accepted_fieldnames.indexOf(i)) {

            case 0:
                //image0
                if(secret.image0) {
                    fs.unlink(public_dir + secret.image0);
                    console.log('successfully deleted ' + secret.image0);
                }
                secret.image0 = files[i].path.replace('public', '');
                break;

            case 1:
                if(secret.image1) {
                    fs.unlink(public_dir + secret.image1);
                    console.log('successfully deleted ' + secret.image1);
                }
                secret.image1 = files[i].path.replace('public', '');
                break;

            case 2:
                if(secret.image2) {
                    fs.unlink(public_dir + secret.image2);
                    console.log('successfully deleted ' + secret.image2);
                }
                secret.image2 = files[i].path.replace('public', '');
                break;

            case 3:
                if(secret.image3) {
                    fs.unlink(public_dir + secret.image3);
                    console.log('successfully deleted ' + secret.image3);
                }
                secret.image3 = files[i].path.replace('public', '');
                break;

            case 4:
                if(secret.image4) {
                    fs.unlink(public_dir + secret.image4);
                    console.log('successfully deleted ' + secret.image4);
                }
                secret.image4 = files[i].path.replace('public', '');
                break;

            case 5:
                if(secret.image5) {
                    fs.unlink(public_dir + secret.image5);
                    console.log('successfully deleted ' + secret.image5);
                }
                secret.image5 = files[i].path.replace('public', '');
                break;

            default:

                console.log("hit default: "+ i);

        }
    }

    if (secret.image0) {
        secret.is_active = true;
    }
    else {
        secret.is_active = false;
    }
    console.log("about to save");
    secret
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
