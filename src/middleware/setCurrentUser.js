const UserService = require("../user");

module.exports = async function setCurrentUser(req, res, next) {
    const { email } = req.headers;
    let user = await UserService.getUserByEmail(email);
    req.user = user;
    console.log("setCurrentUser -> req.user", req.user)   
    next();
  };