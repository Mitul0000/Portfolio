const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },

  shortDescription:{
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

  type:{
    type:String,
    enum:["PAID","FREE"],
    required:true
  },

  link:{
    type:String,
    required:true
  }
},{timestamps:true});

module.exports = mongoose.model('Tools',toolSchema);