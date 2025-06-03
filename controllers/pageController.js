const Notebook = require("../models/notebook");
const Page = require("../models/page");

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

      const oldPages = await Page.find({ notebookId }).sort({ idx: 1 });

      const newPages = await Promise.all(
        pages
          .map(async (pageData, idx) => {
            // if oldPages does not contain the page, create a new one,
            const page =
              oldPages.find((p) => p.id === pageData.id) ||
              new Page({
                id: pageData.id,
                idx: pageData.idx || idx,
                notebookId: notebookId,
                ...pageData,
              });

            await page.save();

            return page;
          })
          .sort({ idx: 1 })
      );

      // delete old pages that are not in the new pages array
      const oldPageIds = oldPages.map((p) => p.id);
      const newPageIds = newPages.map((p) => p.id);
      const pagesToDelete = oldPageIds.filter((id) => !newPageIds.includes(id));
      if (pagesToDelete.length > 0) {
        await Page.deleteMany({ id: { $in: pagesToDelete } });
      }

      res.status(200).json(newPages);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PageController();
