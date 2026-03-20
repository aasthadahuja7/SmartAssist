const express = require("express");
const router = express.Router();

// Import the two controller functions you just wrote
const authController = require("../controllers/authController");

// The explicit POST URLs your frontend will target!
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
