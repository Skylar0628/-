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

    //分頁
    const totalResult = articles.length;
    const perpage = 3;
    const pageTotal = Math.ceil(totalResult/perpage);
    let currentPage = Number.parseInt(req.query.page) || 1; // 從查詢參數獲取當前頁碼，默認為第1頁

    if(currentPage > pageTotal){
      currentPage = pageTotal
    }
    const minItem = (currentPage * perpage) - perpage + 1;
    const macItem = (currentPage * perpage);
    const data = [];
    articles.forEach((item, index)=>{
      const itemNum  = index + 1;
      if(itemNum >= minItem && itemNum <= macItem){
        data.push(item);
      }
      console.log(data)
    });
    const page = {
      pageTotal,
      currentPage,
      hasPre: currentPage > 1,
      hasNex: currentPage < pageTotal,

    }

    //分頁結束
    articles.reverse();
    res.render('index', { 
      title: 'Express',
      categories,
      articles: data,
      striptags,
      moment,
      page
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
     res.render('post', {
      title: 'Express',
      categories,
      article
    });
  });
  res.render('post', { title: 'Express' });
});

module.exports = router;
