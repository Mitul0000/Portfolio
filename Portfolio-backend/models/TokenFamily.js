const mongoose = require('mongoose');
const tokenFamilySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentToken: {
    type: String,
    required: true
  },
  tokenFamily: {
    type: [String],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d' // Tokens will automatically be removed after 7 days
  }
});
module.exports = mongoose.model('TokenFamily', tokenFamilySchema);