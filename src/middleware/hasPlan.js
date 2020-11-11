module.exports = function hasPlan (plan){
  return async (req, res, next) => {
    if (req.user && req.user.plan == plan) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  }};