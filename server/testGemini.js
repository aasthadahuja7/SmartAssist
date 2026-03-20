require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log("Sending query directly to AI...");
    const result = await model.generateContent("Best websites to learn dsa as cse student");
    const response = await result.response;
    console.log("✅ AI RESPONSE:", response.text());
  } catch(e) {
    console.log("❌ ERROR:", e.message);
  }
}
test();
