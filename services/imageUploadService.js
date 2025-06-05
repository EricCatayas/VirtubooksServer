const ImageUpload = require("../models/imageUpload");
const { BlobServiceClient } = require("@azure/storage-blob");
const { generateUID } = require("../utils/generators");

class ImageUploadService {
  AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  containerName = "virtubooks-image-uploads";

  constructor() {
    if (!this.AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error("Azure Storage Connection String is not set.");
    }
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.AZURE_STORAGE_CONNECTION_STRING
    );
  }

  async uploadImage(file, userId) {
    if (!file || !file.buffer) {
      throw new Error("No file provided for upload.");
    }

    // Check if userId is provided
    if (!userId) {
      throw new Error("User ID is required for image upload.");
    }

    // Check if the file is an image
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        "Invalid file type. Only JPEG, PNG, and GIF are allowed."
      );
    }

    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    await containerClient.createIfNotExists();

    // Sanitize the original file name to remove unsafe characters
    const sanitizedOriginalName = file.originalname.replace(
      /[^a-zA-Z0-9.\-_]/g,
      "_"
    );
    const blobName = `${userId}-${Date.now()}-${sanitizedOriginalName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    // if successful, save new ImageUpload record to the database
    const newImageUpload = new ImageUpload({
      id: generateUID(),
      userId: userId,
      imageURL: blockBlobClient.url,
      createdAt: new Date().toISOString(),
    });

    await newImageUpload.save();

    return blockBlobClient.url;
  }

  async getUserImageUploads(userId) {
    if (!userId) {
      throw new Error("User ID is required to fetch image uploads.");
    }

    const imageUploads = await ImageUpload.find({ userId: userId })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();

    return imageUploads.map((upload) => ({
      id: upload.id,
      imageURL: upload.imageURL,
      createdAt: upload.createdAt,
    }));
  }

  async deleteImageUpload(imageId, userId) {
    if (!imageId || !userId) {
      throw new Error(
        "Image ID and User ID are required to delete an image upload."
      );
    }

    const imageUpload = await ImageUpload.findOne({
      id: imageId,
      userId: userId,
    });
    if (!imageUpload) {
      throw new Error("Image upload not found.");
    }

    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    const blockBlobClient = containerClient.getBlockBlobClient(
      imageUpload.imageURL.split("/").pop()
    );

    await blockBlobClient.delete();
    await ImageUpload.deleteOne({ id: imageId });

    return { message: "Image upload deleted successfully." };
  }
}

module.exports = new ImageUploadService();
