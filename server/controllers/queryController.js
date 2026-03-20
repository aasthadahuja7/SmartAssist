const { getGeminiResponse } = require("../services/geminiService");
const db = require("../config/db"); // Import your Docker Database connection!

exports.handleQuery = async (req, res) => {
  try {
    const { query } = req.body;
    console.log("👉 New query received:", query);

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    let imagePart = null;
    let imageName = null; 
    
    if (req.file) {
      imageName = req.file.originalname;
      console.log("📸 Image received:", imageName);
      
      imagePart = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype,
        },
      };
    }

    // 1. Send the text/image to your Google AI Model
    const result = await getGeminiResponse(query, imagePart);
    
    // 2. Stringify it to flat text to store it in SQL
    const finalResponseText = JSON.stringify(result);

    // 3. Inject the conversation into your Docker MySQL Container! 
    const sql = `INSERT INTO queries (query, ai_response, image_name) VALUES (?, ?, ?)`;
    await db.execute(sql, [query, finalResponseText, imageName || "No Image"]);
    
    console.log("💾 Successfully saved conversation to the Docker Database!");

    // 4. Send the structured JSON back to the user
    res.json({
      success: true,
      data: result,
    });
    
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message || "Something went wrong" });
  }
}; // <--- (Properly closed function!)

exports.getHistory = async (req, res) => {
  try {
    // 1. Fetch from MySQL Database
    const [rows] = await db.execute("SELECT * FROM queries ORDER BY created_at DESC");
    
    // 2. Parse the stringified AI data back into real JSON objects
    const formattedHistory = rows.map(row => {
      try {
        row.ai_response = JSON.parse(row.ai_response);
      } catch (e) {
        // Fallback
      }
      return row;
    });

    // 3. Send list to the frontend!
    res.json({
      success: true,
      count: formattedHistory.length,
      data: formattedHistory
    });

  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
};