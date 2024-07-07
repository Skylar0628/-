var express = require('express');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');

const categoriesRef = firebaseAdminDB.ref('categories'); // 全局定义

router.get('/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});

router.get('/categories', function(req, res, next) {
  res.render('dashboard/categories', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

router.post('/categories/create', function(req,res){

  const data = req.body;
  const plainData = {...data}
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  plainData.id = key;

  categoryRef.set(plainData)
  .then(function(){
    res.redirect('/dashboard/categories');
  })
 .catch(function(error){
    console.error("Error creating category:", error);
    res.status(500).send("Error creating category");
  });
});

module.exports = router;