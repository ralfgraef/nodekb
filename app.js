const express = require('express');
const path = require ('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session'); 

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
        title: 'Einkaufslisten',
        articles: articles
      });
    }
  })
});

// Route files
let articles = require('./routes/articles');
app.use('/articles', articles);

// Start Server
app.listen(3000, function() {
  console.log('Server starts at port 3000 ...');
});