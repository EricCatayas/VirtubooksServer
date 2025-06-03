const { v4: uuidv4 } = require("uuid");

module.exports.generateUID = () => {
  return uuidv4();
};
