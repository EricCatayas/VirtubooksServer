const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const NotebookController = require("../controllers/notebookController.js");
const PageController = require("../controllers/pageController.js");

router.get("/", NotebookController.getPublicNotebooks);
router.get("/user", authMiddleware, NotebookController.getUserNotebooks);
router.post("/", authMiddleware, NotebookController.createNotebook);
router.get("/:id", authMiddleware, NotebookController.getNotebook);
router.put("/:id", authMiddleware, NotebookController.updateNotebook);
router.delete("/:id", authMiddleware, NotebookController.deleteNotebook);
router.put("/:notebookId/pages", authMiddleware, PageController.updatePages);
router.put(
  "/:notebookId/pages/:pageId",
  authMiddleware,
  PageController.updatePages
);

module.exports = router;
