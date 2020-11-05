const UserService = require("../user");

module.exports = async function setCurrentUser(req, res, next) {
  // lets the user log in
  // if ( req.path == '/' || req.path== '/login') return next();

  const { email } = req.cookies;

  if (email) {
    user = await UserService.getUserByEmail(email);

    req.user = user;
    console.log("setCurrentUser -> req.email", req.user);
    next();
  } else {
    res.redirect("/");
  }
};
