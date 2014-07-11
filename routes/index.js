var express = require('express');
var router = express.Router();

///* GET home page. */
//router.get('/', function(req, res) {
//  res.render('index', { title: 'Express' });
//});

router.get('/', function(req, res) {
    res.send({
         trips: ["moped, ski, bike, boat"]
        });
});

module.exports = router;
