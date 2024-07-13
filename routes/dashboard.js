var express = require('express');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');

const categoriesRef = firebaseAdminDB.ref('categories'); 
const articlesRef = firebaseAdminDB.ref('articles'); 


router.get('/article/create', function (req, res, next) {
  categoriesRef.once('value', (sna) => {
    const categories = sna.val();
    res.render('dashboard/article', {
      title: 'Express',
      categories
    });
  });
});

router.get('/article/:id', function (req, res, next) {
  const id = req.params.id; //取出文章id
  let categories = {};  // 宣告類別物件來存放firebase資料

  categoriesRef.once('value').then(function(sna){ //從firebase 獲取 categories 資料 => Firebase 獲取文章資料
    categories = sna.val();
    return articlesRef.child(id).once('value') //當讀取完成後，會觸發下一個 then 回調函數
  }).then(function(sna){
     const article = sna.val();
     console.log(article)
     res.render('dashboard/article', {
      title: 'Express',
      categories,
      article
    });
  });
});

// 檔案
router.get('/archives', function (req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});

router.get('/categories', function (req, res, next) {
  const message = req.flash('info')
  categoriesRef.once('value', (sna) => {
    const categories = sna.val();
    res.render('dashboard/categories',
      {
        title: 'Express',
        categories,
        message,
        hasInfo: message.length > 0
      });
  });
});

// 註冊
router.get('/signup', function (req, res, next) {
  res.render('dashboard/signup', { title: 'Express' });
});

// 新增文章
router.post('/article/create', function(req, res) {
  const data = {...req.body};
  const articleRef = articlesRef.push();
  const key = articleRef.key;
  const updateTime = Math.floor(Date.now() /1000);
  data.id = key
  data.update_time = updateTime;
  console.log('data',data);

  articleRef.set(data).then(function(){
    res.redirect(`/dashboard/article/${key}`);
  });
})

// 新增類別
router.post('/categories/create', function (req, res) {

  const data = req.body;
  const plainData = { ...data }
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;
  plainData.id = key;
  categoriesRef.orderByChild('path').equalTo(data.path).once('value')
    .then(function (sna) {
      if (sna.val() !== null) {
        req.flash('info', '已有相同路徑')
        res.redirect('/dashboard/categories');
      } else {
        categoryRef.set(plainData)
          .then(function () {
            res.redirect('/dashboard/categories');
          })
          .catch(function (error) {
            console.error("Error creating category:", error);
            res.status(500).send("Error creating category");
          });
      }
    })
});

// 刪除類別
router.post('/categories/delete/:id', function (req, res) {
  const id = req.params.id;
  categoriesRef.child(id).remove();
  req.flash('info', '欄位已刪除')
  res.redirect('/dashboard/categories');
})



module.exports = router;