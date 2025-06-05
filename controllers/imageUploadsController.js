const ImageUploadService = require("../services/imageUploadService");

class ImageUploadsController {
  async getUserImageUploads(req, res, next) {
    try {
      const userId = req.user.id;
      const imageUploads = await ImageUploadService.getUserImageUploads(userId);
      res.status(200).json(imageUploads);
    } catch (error) {
      next(error);
    }
  }

  async uploadImage(req, res, next) {
    try {
      const userId = req.user.id;
      const file = req.file; // Assuming you're using multer for file uploads
      if (!file) {
        return res.status(400).json({ message: "No file uploaded." });
      }
      const imageUrl = await ImageUploadService.uploadImage(file, userId);
      res.status(201).json({ imageUrl });
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req, res, next) {
    try {
      const userId = req.user.id;
      const imageId = req.params.id; // Assuming the image ID is passed as a URL parameter
      await ImageUploadService.deleteImageUpload(imageId, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ImageUploadsController();
