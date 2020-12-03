const User = require('./user.model')
const UserService = require('./user.service')

module.exports = UserService(User)
