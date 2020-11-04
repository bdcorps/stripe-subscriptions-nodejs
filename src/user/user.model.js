var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String,
  billingID: String,
  plan: { type: String, enum: ["none", "basic", "pro"], default: "none" },
  hasTrial: {type: Boolean, default: false},
  endDate: {type: Date, default: null},
});

var userModel = mongoose.model("user", userSchema, "user");

module.exports = userModel;
