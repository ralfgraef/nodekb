let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: String,
    required: true
  },
  list_item:{
    type: Array,
    required: true
  },
  date:{
    type: String
  }
});

let Article = module.exports = mongoose.model('Article', articleSchema);