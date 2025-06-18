const { v4: uuidv4 } = require("uuid");

module.exports.generateUID = () => {
  return uuidv4();
};

module.exports.generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .substring(0, 50); // Limit to 50 characters
};
