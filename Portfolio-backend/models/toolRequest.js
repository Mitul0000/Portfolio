const mongoose = require('mongoose');

const toolRequestSchema = new mongoose.Schema({
  createdBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  toolDescription:{
    type:String,
    required:true
  },
  budget:{
    type:Number,
    required:true
  },
  adminMessage:{
    type:String,
    default:"No comment"
  },
  status:{
    type:String,
    enum:['PENDING','REJECTED','APPROVED'],
    default:'PENDING'
  }

},{timestamps:true});

module.exports = mongoose.model('ToolRequest', toolRequestSchema);