const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Route to generate a token
router.post("/generate-token", authController.generateToken);

module.exports = router;
