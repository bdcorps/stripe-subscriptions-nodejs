var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  billingID: String,
  planType: { type: String, enum: ["none","trial", "basic", "pro"], default: "none" },
  endDate: Date
});

var userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;
