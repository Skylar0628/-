var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Express' });
});

router.get('/doshboard/article', function(req, res, next) {
  res.render('doshboard/article', { title: 'Express' });
});

router.get('/doshboard/archives', function(req, res, next) {
  res.render('doshboard/archives', { title: 'Express' });
});

router.get('/doshboard/categories', function(req, res, next) {
  res.render('doshboard/categories', { title: 'Express' });
});

router.get('/doshboard/signup', function(req, res, next) {
  res.render('doshboard/signup', { title: 'Express' });
});



module.exports = router;
