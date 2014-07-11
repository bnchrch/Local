var express = require('express');
var router = express.Router();

//var knex = require('knex')({
//    client: 'pg',
//    connection: {
//        host     : '127.0.0.1',
//        user     : '',
//        password : '',
//        database : 'mydb'
//    }
//});

var experiences = {
    "listings":5,
    "page":
    {
        "current":1,
        "total":1
    },
    "results":
        [
            {
                "id":1,
                "title":"Banff Lake Cruise",
                "price":65.00,
                "rate":"per person",
                "user": {
                    "username": "Brewster Travel",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "tile_image":"http://www.imgur.com/3424sad.jpg",
                "distance":3.4,
                "rating":0.87,
                "num_reviews":23
            },
            {
                "id":2,
                "title":"Holi Festival Tour",
                "price":28.00,
                "rate":"per person",
                "user": {
                    "username": "Kiera David",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "tile_image":"http://www.imgur.com/3424sad.jpg",
                "distance":5.41,
                "rating":0.91,
                "num_reviews":14
            },
            {
                "id":3,
                "title":"White Water Rafing",
                "price":75.00,
                "rate":"per person",
                "user": {
                    "username": "Maverick Tours",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "tile_image":"http://www.imgur.com/3424sad.jpg",
                "distance":10,
                "rating":0.87,
                "num_reviews":8
            },
            {
                "id":4,
                "title":"Paris Photography Tour",
                "price":25.00,
                "rate":"per person",
                "user": {
                    "username": "John French",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "tile_image":"http://www.imgur.com/3424sad.jpg",
                "distance":0.86,
                "rating":0.78,
                "num_reviews":7
            },
            {
                "id":5,
                "title":"Group Ski Lessons",
                "price":125.00,
                "rate":"per day",
                "user": {
                    "username": "Sunshine Ski School",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "tile_image":"http://www.imgur.com/3424sad.jpg",
                "distance":12.86,
                "rating":0.72,
                "num_reviews":88
            }
        ]
};

var individual_experience = {
        "results": [
            {
                "id":1,
                "title":"Banff Lake Cruise",
                "price":65.00,
                "rate":"per person",
                "user": {
                    "username": "Brewster Travel",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "images":
                    [
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg"
                    ],
                "distance":3.4,
                "rating":0.87,
                "num_reviews":23,
                "reviews":
                    [
                        {
                            "name": "Jerry",
                            "time": "2014-01-10",
                            "profile_picture":"http://www.imgur.com/123213asd.jpg",
                            "uid": 23453,
                            "rating": 1,
                            "review": "Great experience would do again"
                        },
                        {
                            "name": "Cairie",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.84,
                            "review": "Was the time of my entire trip but i forgot my rain jacket LOL"
                        },
                        {
                            "name": "Marry",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.56,
                            "review": "bahumbug"
                        }

                    ],
                "description": "This is the description"

            },
            {
                "id":2,
                "title":"Holi Festival Tour",
                "price":28.00,
                "rate":"per person",
                "user": {
                    "username": "Kiera David",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "images":
                    [
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg"
                    ],
                "distance":5.41,
                "rating":0.91,
                "num_reviews":14
            },
            {
                "id":3,
                "title":"White Water Rafing",
                "price":75.00,
                "rate":"per person",
                "user": {
                    "username": "Maverick Tours",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "images":
                    [
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg"
                    ],
                "distance":10,
                "rating":0.87,
                "num_reviews":8,
                "reviews":
                    [
                        {
                            "name": "Jerry",
                            "time": "2014-01-10",
                            "profile_picture":"http://www.imgur.com/123213asd.jpg",
                            "uid": 23453,
                            "rating": 1,
                            "review": "Great experience would do again"
                        },
                        {
                            "name": "Cairie",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.84,
                            "review": "Was the time of my entire trip but i forgot my rain jacket LOL"
                        },
                        {
                            "name": "Marry",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.56,
                            "review": "bahumbug"
                        }

                    ],
                "description": "This is the description"
            },
            {
                "id":4,
                "title":"Paris Photography Tour",
                "price":25.00,
                "rate":"per person",
                "user": {
                    "username": "John French",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "images":
                    [
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg"
                    ],
                "distance":0.86,
                "rating":0.78,
                "num_reviews":7,
                "reviews":
                    [
                        {
                            "name": "Jerry",
                            "time": "2014-01-10",
                            "profile_picture":"http://www.imgur.com/123213asd.jpg",
                            "uid": 23453,
                            "rating": 1,
                            "review": "Great experience would do again"
                        },
                        {
                            "name": "Cairie",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.84,
                            "review": "Was the time of my entire trip but i forgot my rain jacket LOL"
                        },
                        {
                            "name": "Marry",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.56,
                            "review": "bahumbug"
                        }

                    ],
                "description": "This is the description"
            },
            {
                "id":5,
                "title":"Group Ski Lessons",
                "price":125.00,
                "rate":"per day",
                "user": {
                    "username": "Sunshine Ski School",
                    "email": "email@email.ca",
                    "phone_number": "1112223333"
                },
                "images":
                    [
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg",
                        "http://www.imgur.com/3424sad.jpg"
                    ],
                "distance":12.86,
                "rating":0.72,
                "num_reviews":88,
                "reviews":
                    [
                        {
                            "name": "Jerry",
                            "time": "2014-01-10",
                            "profile_picture":"http://www.imgur.com/123213asd.jpg",
                            "uid": 23453,
                            "rating": 1,
                            "review": "Great experience would do again"
                        },
                        {
                            "name": "Cairie",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.84,
                            "review": "Was the time of my entire trip but i forgot my rain jacket LOL"
                        },
                        {
                            "name": "Marry",
                            "time": "2014-01-10",
                            "uid": 23453,
                            "rating": 0.56,
                            "review": "bahumbug"
                        }

                    ],
                "description": "This is the description"
            }
        ]
};


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
        //when we have params return response
        res.send(experiences);

    };



});

router.get('/:id', function(req, res) {
    var id = req.params.id;
    return_experience = individual_experience.results[id-1];
    if (!return_experience) res.send("could not find experience")
    else res.send(return_experience);
});

module.exports = router;
