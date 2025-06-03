const express = require("express");
const router = express.Router();
const PageController = require("../controllers/pageController.js");
const { authMiddleware } = require("../middlewares/authMiddleware.js");

router.get("/:notebookId", authMiddleware, PageController.getPages);
router.put("/:notebookId", authMiddleware, PageController.updatePages);

module.exports = router;
