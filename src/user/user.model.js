const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: String,
  billingID: String,
  plan: { type: String, enum: ['none', 'basic', 'pro'], default: 'none' },
  hasTrial: { type: Boolean, default: false },
  endDate: { type: Date, default: null }
})

const userModel = mongoose.model('user', userSchema, 'user')

module.exports = userModel
