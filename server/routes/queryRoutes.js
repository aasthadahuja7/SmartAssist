// This is the entry point where user request comes
const express = require("express");
const multer = require("multer");
const router = express.Router();
const { handleQuery } = require("../controllers/queryController");

// Tell Multer to keep the image in RAM (memory) so we can send it directly to Gemini
const upload = multer({ storage: multer.memoryStorage() });

// Add the upload middleware BEFORE your controller runs
router.post("/ask", upload.single("image"), handleQuery);

module.exports = router;
