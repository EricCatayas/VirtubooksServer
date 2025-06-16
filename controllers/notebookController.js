const Notebook = require("../models/notebook");
const Page = require("../models/page");
const authService = require("../services/authService.js");
const { arrayToIdMap } = require("../utils/converters");
const { generateUID } = require("../utils/generators");

class NotebookController {
  // Get a specific notebook by ID and user ID
  async getNotebook(req, res, next) {
    try {
      const userId = req.user?.id;
      const notebook = await Notebook.findOne({
        id: req.params.id,
      }).populate("pages");

      if (!notebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }

      if (
        notebook.visibility === "private" &&
        String(notebook.userId) !== String(userId)
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (req.user && String(notebook.userId) === String(req.user.id)) {
        notebook.author = req.user.username;
      } else {
        const author = await authService.getUserById(notebook.userId);
        notebook.author = author.username;
      }

      res.status(200).json(notebook);
    } catch (error) {
      next(error);
    }
  }
  // Get all notebooks for a user
  async getNotebooksFromUser(req, res, next) {
    try {
      const currentUserId = req.user ? req.user.id : null;
      const authorId = req.params.userId;
      const author = await authService.getUserById(authorId);

      if (!authorId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      if (!author) {
        return res.status(404).json({ message: "User not found" });
      }

      const notebooks =
        String(authorId) === String(currentUserId)
          ? await Notebook.find({ userId: authorId }).populate("pages")
          : await Notebook.find({
              userId: authorId,
              visibility: "public",
            }).populate("pages");

      notebooks.forEach((notebook) => {
        notebook.author = author.username || "Unknown Author";
      });

      res.status(200).json(notebooks);
    } catch (error) {
      next(error);
    }
  }

  async getFilteredNotebooks(req, res, next) {
    try {
      const {
        userId,
        search,
        title,
        description,
        author,
        tags,
        s_updatedAt,
        s_createdAt,
        limit,
      } = req.query;

      let filter = {};

      if (search) {
        const searchRegex = new RegExp(search, "i");
        filter = {
          $or: [
            { title: searchRegex },
            { description: searchRegex },
            { tags: searchRegex },
          ],
        };
      }

      if (title) {
        filter.title = { $regex: title, $options: "i" };
      }

      if (description) {
        filter.description = { $regex: description, $options: "i" };
      }

      if (author) {
      }

      if (tags) {
        filter.tags = { $regex: tags, $options: "i" };
      }

      if (userId) {
        filter.userId = userId;
      }

      if (!req.user || String(req.user.id) !== String(userId)) {
        filter.visibility = "public";
      }

      const sort = {
        ...(s_updatedAt ? { updatedAt: s_updatedAt === "asc" ? 1 : -1 } : {}),
        ...(s_createdAt ? { createdAt: s_createdAt === "asc" ? 1 : -1 } : {}),
      };

      console.log("Filter:", filter);
      const result = await Notebook.find(filter)
        .sort(sort)
        .limit(Number(limit))
        .populate("pages");

      const users = await authService.getUsers();
      const mappedUsers = arrayToIdMap(users);
      result.forEach((notebook) => {
        notebook.author =
          mappedUsers[notebook.userId]?.username || "Unknown Author";
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // Get all public notebooks
  async getPublicNotebooks(req, res, next) {
    try {
      const notebooks = await Notebook.find({ visibility: "public" }).populate(
        "pages"
      );
      const users = await authService.getUsers();
      const mappedUsers = arrayToIdMap(users);
      notebooks.forEach((notebook) => {
        notebook.author =
          mappedUsers[notebook.userId]?.username || "Unknown Author";
      });
      res.status(200).json(notebooks);
    } catch (error) {
      next(error);
    }
  }

  // Create a new notebook
  async createNotebook(req, res, next) {
    try {
      const {
        title,
        description,
        visibility,
        aspectRatio,
        tags,
        numberOfPages,
        coverImageURL,
      } = req.body;

      const newNotebook = new Notebook({
        id: generateUID(),
        userId: req.user.id,
        title,
        description,
        visibility,
        aspectRatio,
        tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        styles: {},
        pages: [],
      });

      // create blank pages if numberOfPages is provided
      if (numberOfPages && numberOfPages > 0) {
        for (let i = 0; i < numberOfPages; i++) {
          const page = new Page({
            id: generateUID(),
            idx: i,
            notebookId: newNotebook.id,
            isNumberedPage: false,
            styles: {},
            contents: [],
          });
          await page.save();
          newNotebook.pages.push(page._id);
        }

        const firstPageId = newNotebook.pages[0];
        const firstPage = await Page.findById(firstPageId);

        if (title) {
          firstPage.contents.push({
            value: title,
            type: "heading",
          });
        }

        if (description) {
          firstPage.contents.push({
            value: description,
            type: "paragraph",
          });
        }

        if (coverImageURL) {
          firstPage.backgroundImageURL = coverImageURL;
        }

        await firstPage.save();
      }

      await newNotebook.save();
      newNotebook.author = req.user.username;
      res.status(201).json(newNotebook);
    } catch (error) {
      next(error);
    }
  }
  // Update a notebook
  async updateNotebook(req, res, next) {
    try {
      const { title, description, visibility, aspectRatio, tags, styles } =
        req.body;
      const updatedNotebook = await Notebook.findOneAndUpdate(
        { id: req.params.id, userId: req.user.id },
        {
          title,
          description,
          visibility,
          aspectRatio,
          tags,
          styles,
          updatedAt: new Date().toISOString(),
        },
        { new: true }
      );
      if (!updatedNotebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }
      res.status(200).json(updatedNotebook);
    } catch (error) {
      next(error);
    }
  }
  // Delete a notebook
  async deleteNotebook(req, res, next) {
    try {
      const deletedNotebook = await Notebook.findOneAndDelete({
        id: req.params.id,
        userId: req.user.id,
      });
      if (!deletedNotebook) {
        return res.status(404).json({ message: "Notebook not found" });
      }
      res.status(200).json({ message: "Notebook deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NotebookController();
