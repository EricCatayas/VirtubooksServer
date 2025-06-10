const express = require("express");
const router = express.Router();
const {
  authMiddleware,
  parseUserFromToken,
} = require("../middlewares/authMiddleware.js");
const NotebookController = require("../controllers/notebookController.js");
const PageController = require("../controllers/pageController.js");

router.get("/", NotebookController.getPublicNotebooks);
router.get(
  "/user/:userId",
  parseUserFromToken,
  NotebookController.getNotebooksFromUser
);
router.get(
  "/filter",
  parseUserFromToken,
  NotebookController.getFilteredNotebooks
);
router.post("/", authMiddleware, NotebookController.createNotebook);
router.get("/:id", parseUserFromToken, NotebookController.getNotebook);
router.put("/:id", authMiddleware, NotebookController.updateNotebook);
router.delete("/:id", authMiddleware, NotebookController.deleteNotebook);
router.put("/:notebookId/pages", authMiddleware, PageController.updatePages);
router.put(
  "/:notebookId/pages/:pageId",
  authMiddleware,
  PageController.updatePages
);

module.exports = router;
