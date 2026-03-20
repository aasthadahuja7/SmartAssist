// Controller = handles logic between request and response
const { getGeminiResponse } = require("../services/geminiService");

exports.handleQuery = async (req, res) => {
  try {
    const { query } = req.body;
    console.log("👉 New query received from Postman:", query);

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    let imagePart = null;
    if (req.file) {
      console.log("📸 Image received:", req.file.originalname);
      
      // 2. Convert the image into a Base64 string that Gemini can understand
      imagePart = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      };
    }
    // 3. Pass both the text query AND the image to the AI service
    const result = await getGeminiResponse(query, imagePart);

    res.json({
      success: true,
      response: result,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
};