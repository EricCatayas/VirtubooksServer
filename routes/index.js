const express = require("express");
const router = express.Router();
const notebookRoute = require("./notebookRoute");

router.use("/notebooks", notebookRoute);

module.exports = router;
