const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Page = require("./page");
const { generateUID } = require("../utils/generators");

const notebookSchema = new Schema(
  {
    id: { type: String, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    author: { type: String },
    aspectRatio: {
      type: String,
      enum: ["6:9", "13:20", "3:5", "7:9", "1:1"],
      required: true,
    },
    slug: { type: String, unique: true },
    tags: { type: String },
    createdAt: { type: String },
    updatedAt: { type: String },
    styles: { type: Schema.Types.Mixed },
    pages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Page",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// pageCount does not exist in the database
notebookSchema.virtual("pageCount").get(function () {
  return this.pages.length;
});

notebookSchema.post("findOneAndDelete", async function (notebook) {
  if (notebook) {
    await Page.deleteMany({ notebookId: notebook.id });
  }
});

notebookSchema.pre("save", function (next) {
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

notebookSchema.pre("updateOne", function (next) {
  if (!this.updatedAt) {
    this.updatedAt = new Date().toISOString();
  }
  next();
});

const Notebook = mongoose.model("Notebook", notebookSchema);
module.exports = Notebook;
