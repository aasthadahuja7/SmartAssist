// This is the entry point where user request comes
const express = require("express");
const multer = require("multer");
const router = express.Router();

// Import the new getHistory function alongside handleQuery!
const { handleQuery, getHistory } = require("../controllers/queryController");

const upload = multer({ storage: multer.memoryStorage() });

// Your existing POST route
router.post("/ask", upload.single("image"), handleQuery);

// 🔥 The brand new GET route for history!
router.get("/history", getHistory);

module.exports = router;
