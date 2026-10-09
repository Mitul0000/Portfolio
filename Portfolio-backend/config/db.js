// This file manages the connection to the database.

require('dotenv').config()
const mongoose = require('mongoose')

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is missing in .env')
  process.exit(1)
}

const MongoDBConnect = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))

module.exports = MongoDBConnect