const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

// Bring in models
let Article = require('../models/article');

// Edit Article
router.get('/edit/:id/:aid', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title: 'Listeneintrag ändern',
      article: article,
      watt: article.list_item.find(x => x.id == req.params.aid)
    });
  });
});

// Add Route
router.get('/add', function(req, res) {
  res.render('add_article', {
    title: 'Neue Liste anlegen'
  });
});

// Add_item Route
router.get('/article_item/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('add_new_item', {
      title: 'Listeneintrag hinzu',
      article: article
    });
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
  let article = new Article({
    title:req.body.title,
    author:req.body.author,
    list_item: {
      id: new Date().valueOf(),
      name: req.body.list_item,
      checked: false
    }
  });
  
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
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
      id: new Date().valueOf(),
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

// Add new item POST Route
router.post('/add_new_item/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    let eintrag = {
      id: new Date().valueOf(),
      name: req.body.list_item,
      checked: false
    };
    article.list_item.push(eintrag);
    
    let query = {_id: req.params.id};

    Article.update(query, article, function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Eintrag aktualisiert!');
        res.redirect('/articles/' + req.params.id);
      }
    });
  });
});

  
//Update checkbox PUT Route
router.put('/edit_check/:id/:did', function(req, res) {
  let query = {_id: req.params.id};
  Article.findById(query, function(err, article) {
    let latt = article.list_item.find(x => x.id == req.params.did);
    latt.checked =! latt.checked;
    
    Article.update(query, article, function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Eintrag aktualisiert!');
        res.send('Success');
      }
    });
  })
 
});


// Update Submit POST Route
router.post('/edit/:id/:aid', function(req, res) {
  let query = {_id: req.params.id};
  Article.findById(query, function(err, article) {
    let zatt = article.list_item.find(x => x.id == req.params.aid);
    zatt.name = req.body.list_item;

    Article.update(query, article, function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Eintrag aktualisiert!');
        res.redirect('/articles/' + req.params.id);
      }
    });
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