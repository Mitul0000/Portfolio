// This file manages the connection to the database.

require('dotenv').config()
const mongoose = require('mongoose')

const MongoDBConnect = mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err))

module.exports = MongoDBConnect