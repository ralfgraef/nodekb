const express = require('express');
const path = require ('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

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

// Add Route
app.get('/articles/add', function(req, res) {
  res.render('add_article', {
    title: 'Add Articles'
  });
});

// Add Submit POSTRoute
app.post('/articles/add', function(req, res) {
  let article = new Article();
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  article.save(function(err) {
    if(err) {
      console.log(err);
      return;
    } else {
      res.redirect('/');
    }
  });
});



// Start Server
app.listen(3000, function() {
  console.log('Server starts at port 3000 ...');
});