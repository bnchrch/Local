var express = require('express');
var router = express.Router();

///* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//router.get('/', function(req, res) {
//    res.send("Welcome to Local! we are still constructing the web page")
//});

module.exports = router;
