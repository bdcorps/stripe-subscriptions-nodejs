module.exports = function hasPlan (plan){
  return async (req, res, next) => {
  console.log("plan", req.user.plan, plan);
    if (req.user && req.user.plan == plan) {
      console.log("plan matches");
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  }};