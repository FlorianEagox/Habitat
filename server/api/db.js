// MongoDB connection and Monk setup for users collection
const monk = require('monk')
const bcrypt = require('bcryptjs')

const db = monk(process.env.MONGO_URL || 'localhost/habitat')
const users = db.get('users')

module.exports = { db, users, bcrypt }
