var express = require('express');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');
const categoriesRef = firebaseAdminDB.ref('categories'); 
const articlesRef = firebaseAdminDB.ref('articles'); 
const striptags = require('striptags');
const moment = require('moment');


/* GET home page. */
router.get('/', function(req, res, next) {
  let categories = {};
  const articles = [];

  categoriesRef.once('value').then((sna)=>{
    categories = sna.val();
    return articlesRef.orderByChild('update_time').once('value')
  }).then((sna)=>{
    sna.forEach(item => {
      if ('public' === item.val().status){
        articles.push(item.val());
     }
    });
    articles.reverse();
    console.log(categories,articles)
    res.render('index', { 
      title: 'Express',
      categories,
      articles,
      striptags,
      moment
    });
  });
});

router.get('/post/:id', function(req, res, next) {
  const id = req.params.id; //取出文章id
  let categories = {};  // 宣告類別物件來存放firebase資料

  categoriesRef.once('value').then(function(sna){ //從firebase 獲取 categories 資料 => Firebase 獲取文章資料
    categories = sna.val();
    return articlesRef.child(id).once('value') //當讀取完成後，會觸發下一個 then 回調函數
  }).then(function(sna){
     const article = sna.val();
     console.log(article)
     res.render('post', {
      title: 'Express',
      categories,
      article
    });
  });
  res.render('post', { title: 'Express' });
});

module.exports = router;
