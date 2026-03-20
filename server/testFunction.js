require('dotenv').config();
const { getGeminiResponse } = require("./services/geminiService.js");

async function run() {
  console.log("Calling getGeminiResponse...");
  try {
    const res = await getGeminiResponse("Best websites to learn dsa as cse student");
    console.log("✅ GOT RESPONSE:", res.substring(0, 100) + "...");
  } catch(e) {
    console.log("❌ ERROR:", e);
  }
}
run();
