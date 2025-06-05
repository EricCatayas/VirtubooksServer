const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { generateUID } = require("../utils/generators");

const pageSchema = new Schema({
  id: { type: String, required: true },
  idx: { type: Number, required: true },
  notebookId: { type: String, required: true },
  isNumberedPage: { type: Boolean, default: false },
  pageNumber: { type: Number },
  backgroundImageURL: { type: String },
  styles: { type: Schema.Types.Mixed },
  createdAt: { type: String },
  updatedAt: { type: String },
  contents: [
    {
      value: { type: String, required: true },
      type: {
        type: String,
        enum: ["heading", "paragraph", "image"],
        required: true,
      },
      styles: { type: Schema.Types.Mixed },
    },
  ],
});

pageSchema.pre("save", function (next) {
  if (!this.id) {
    this.id = generateUID();
  }
  if (!this.createdAt) {
    this.createdAt = new Date().toISOString();
  }
  if (!this.updatedAt) {
    this.updatedAt = new Date().toISOString();
  }
  next();
});

pageSchema.pre("updateOne", function (next) {
  if (!this.updatedAt) {
    this.updatedAt = new Date().toISOString();
  }
  next();
});

const Page = mongoose.model("Page", pageSchema);
module.exports = Page;
