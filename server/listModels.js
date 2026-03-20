require('dotenv').config();
const axios = require('axios');

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.log("No GEMINI_API_KEY found in .env");
      return;
    }
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    console.log(`Successfully fetched from ListModels. Found ${res.data.models?.length || 0} models.`);
    const textModels = res.data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    console.log("Models that support generateContent:");
    textModels.forEach(m => console.log(" - " + m.name));
  } catch (e) {
    console.error("Failed to list models:");
    console.error(e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
  }
}

listModels();
