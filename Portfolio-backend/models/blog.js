const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },

  content:{
    type:String,
    required:true
  },

  thumbnail:{
    type:String,
    required:true
  },

  tag:{
    type:String,
  },
  views: {
    type:Number,
    default:0
  }
},{timestamps:true});

module.exports = mongoose.model('Blog',blogSchema);