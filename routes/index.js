const express = require("express");
const router = express.Router();
const notebookRoute = require("./notebookRoute");
const imageUploadsRoute = require("./imageUploadsRoute");

router.use("/notebooks", notebookRoute);
router.use("/image-uploads", imageUploadsRoute);

module.exports = router;
