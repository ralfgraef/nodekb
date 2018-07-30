const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// Bring in models
let Article = require('../models/article');

// Edit Article
router.get('/edit/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// Add Route
router.get('/add', function(req, res) {
  res.render('add_article', {
    title: 'Liste hinzu'
  });
});

// Add Submit POST Route
router.post('/add', 
[
  check('title').isLength({min:1}).withMessage('Title required'),
  check('author').isLength({min:1}).withMessage('Author required'),
  check('list_item').isLength({min:1}).withMessage('List_item required')
],

(req, res, next) => {
  console.log(req.body);
  let article = new Article({
    title:req.body.title,
    author:req.body.author,
    list_item: {
      name: req.body.list_item,
      checked: false
    }
  });
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.mapped());
    console.log(article);
      res.render('add_article',
      { 
        title: 'Add Articles',
        article: article,
        errors: errors.mapped()
      });
  } else {
    var dateobj = new Date();
    function pad(n) {return n < 10 ? "0"+n : n;}
    var result = pad(dateobj.getDate())+"."+pad(dateobj.getMonth()+1)+"."+dateobj.getFullYear();
    article.title = req.body.title;
    article.author = req.body.author;
    article.list_item = {
      name: req.body.list_item,
      checked: false
    }
    article.date = result;
    article.save(function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Liste hinzugefügt!');
        res.redirect('/');
      }
    });
  };
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res) {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id: req.params.id};

  Article.update(query, article, function(err) {
    if(err) {
      console.log(err);
      return;
    } else {
      req.flash('success', 'Article updated!');
      res.redirect('/');
    }
  });
});

// Delete Article
router.delete('/:id', function(req, res) {
  let query = {_id: req.params.id}

  Article.remove(query, function(err) {
    if(err) {
      console.log(err);
      return;
    } 
    res.send('Success');
  });
});

// Get Single Article
router.get('/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
      article: article
    });
  });
});


module.exports = router;