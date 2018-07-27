const express = require('express');
const path = require ('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');

const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');   

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

// Check connection
db.once('open', function() {
  console.log('Connected to MongoDB!');
});

// Check for DB errors
db.on('error', function(err) {
  console.log(err);
});

// Init App
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set middleware express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// Set middelware espress messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Set middleware express-validator

// Bring in models
let Article = require('./models/article');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    if(err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  })
  
});

// Get Single Article
app.get('/article/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('article', {
      article: article
    });
  });
});

// Edit Article
app.get('/article/edit/:id', function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    res.render('edit_article', {
      title: 'Edit Article',
      article: article
    });
  });
});

// Add Route
app.get('/articles/add', function(req, res) {
  res.render('add_article', {
    title: 'Add Articles'
  });
});

// Add Submit POST Route
app.post('/articles/add', 
[
  check('title').isLength({min:1}).withMessage('Title required'),
  check('author').isLength({min:1}).withMessage('Author required'),
  check('body').isLength({min:1}).withMessage('Body required')
],

(req, res, next) => {
  
  let article = new Article({
    title:req.body.title,
    author:req.body.author,
    body:req.body.body
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
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err) {
      if(err) {
        console.log(err);
        return;
      } else {
        req.flash('success', 'Article added!');
        res.redirect('/');
      }
    });
  };
});

// Update Submit POST Route
app.post('/articles/edit/:id', function(req, res) {
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
app.delete('/article/:id', function(req, res) {
  let query = {_id: req.params.id}

  Article.remove(query, function(err) {
    if(err) {
      console.log(err);
      return;
    } 
    res.send('Success');
  });
});
// Start Server
app.listen(3000, function() {
  console.log('Server starts at port 3000 ...');
});