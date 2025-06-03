const mongoose = require("mongoose");

module.exports.generateUID = () => {
  return new mongoose.Types.ObjectId().toString();
};
