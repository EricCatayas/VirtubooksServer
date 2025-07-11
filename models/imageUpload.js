const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateUID } = require("../utils/generators");

const imageUploadSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  imageURL: { type: String, required: true },
  createdAt: { type: String },
});

imageUploadSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = generateUID();
  }
  if (!this.createdAt) {
    this.createdAt = new Date().toISOString();
  }
  next();
});

const ImageUpload = mongoose.model("ImageUpload", imageUploadSchema);

module.exports = ImageUpload;
