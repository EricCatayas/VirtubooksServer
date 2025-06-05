const Notebook = require("../models/notebook");
const Page = require("../models/page");
const { generateUID } = require("../utils/generators");

class PageController {
  async getPages(req, res, next) {
    try {
      const notebookId = req.params.notebookId;
      const pages = await Page.find({ notebookId }).sort({ idx: 1 });
      res.status(200).json(pages);
    } catch (error) {
      next(error);
    }
  }

  async updatePage(req, res, next) {
    try {
      const { pageId } = req.params;
      const pageData = req.body;

      const page = await Page.findByIdAndUpdate(
        pageId,
        { ...pageData, updatedAt: new Date().toISOString() },
        { new: true }
      );
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.status(200).json(page);
    } catch (error) {
      next(error);
    }
  }

  async updatePages(req, res, next) {
    try {
      const { pages } = req.body;
      const notebookId = req.params.notebookId;
      if (!Array.isArray(pages)) {
        return res.status(400).json({ message: "Invalid pages format" });
      }

      const notebook = await Notebook.findOne({ id: notebookId }).populate(
        "pages"
      );

      if (!notebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      const prevPages = notebook.pages || [];

      const newPages = await Promise.all(
        pages.map(async (pageData, idx) => {
          let prevPage = prevPages.find((p) => p.id === pageData.id);
          if (prevPage) {
            Object.assign(prevPage, pageData, {
              idx: idx,
              updatedAt: new Date().toISOString(),
              notebookId,
            });
          } else {
            prevPage = new Page({
              id: pageData.id || generateUID(),
              notebookId,
              ...pageData,
              idx: idx,
            });
          }
          await prevPage.save();
          return prevPage;
        })
      );

      // delete old pages that are not in the new pages array
      const oldPageIds = prevPages.map((p) => p.id);
      const newPageIds = newPages.map((p) => p.id);
      const pagesToDelete = oldPageIds.filter((id) => !newPageIds.includes(id));
      if (pagesToDelete.length > 0) {
        await Page.deleteMany({ id: { $in: pagesToDelete } });
      }

      // update the notebook's pages array
      notebook.pages = newPages.map((p) => p._id);
      notebook.updatedAt = new Date().toISOString();
      await notebook.save();

      const updatedNotebook = await Notebook.findOne({
        id: notebookId,
      }).populate("pages");
      res.status(200).json(updatedNotebook);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PageController();
