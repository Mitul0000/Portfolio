const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  shortDescription:{
    type:String,
    required:true
  },
  longDescription:{
    type:String,
  },
  thumbnail:{
    type:String,
    required:true
  },
  tag:{
    type:String,
  },
  link:{
    type:String,
    required:true
  }
},{timestamps:true});

module.exports = mongoose.model('Service', serviceSchema);