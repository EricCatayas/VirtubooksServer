const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Route to generate a token
router.post("/generate-token", authController.generateToken);
router.get("/user", authController.getUserFromToken);

module.exports = router;
