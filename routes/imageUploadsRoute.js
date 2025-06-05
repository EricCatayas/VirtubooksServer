const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authMiddleware } = require("../middlewares/authMiddleware.js");
const ImageUploadsController = require("../controllers/imageUploadsController.js");

const upload = multer(); // You can configure storage/destination as needed

router.get("/", authMiddleware, ImageUploadsController.getUserImageUploads);
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  ImageUploadsController.uploadImage
);
router.delete("/:id", authMiddleware, ImageUploadsController.deleteImage);

module.exports = router;
