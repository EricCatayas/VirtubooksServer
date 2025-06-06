const express = require("express");
const router = express.Router();
const notebookRoute = require("./notebookRoute");
const imageUploadsRoute = require("./imageUploadsRoute");
const authRoute = require("./authRoute");

router.use("/notebooks", notebookRoute);
router.use("/image-uploads", imageUploadsRoute);
router.use("/auth", authRoute);

module.exports = router;
