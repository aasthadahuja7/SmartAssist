const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.getGeminiResponse = async (query, imagePart) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // 1. Force the model to ONLY speak in JSON
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json" 
      }
    });

    // 2. Secretly inject a template so the AI knows EXACTLY how to format its response
    const myHiddenInstruction = `
      You are an assistant. Strictly analyze the query and return ONLY valid JSON array format. 
      Format exactly like this: [ { "title": "Recommendation Name", "details": "Short explanation or prices" } ]
    `;

    // 3. Make the ultimate payload
    let payload;
    if (imagePart) {
      payload = [myHiddenInstruction, query, imagePart]; 
    } else {
      payload = [myHiddenInstruction, query];
    }

    const result = await model.generateContent(payload);
    const response = await result.response;
    
    // 4. Before returning the text, we parse it into a REAL structural Javascript Array/Object
    return JSON.parse(response.text());
    
  } catch (error) {
    console.error("Gemini SDK Error:", error.message);
    throw new Error("Failed to get response from AI");
  }
};
