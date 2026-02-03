const { GoogleGenAI } = require("@google/genai");

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Primary model (fast, human-like)
const primaryModel = "gemini-2.5-flash";

// Fallback model (stable, smarter)
const fallbackModel = "gemini-2.5-flash-lite";

async function generate(model, prompt) {
  const result = await genAI.models.generateContent({
    model,
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 120,
    },
  });

  return result.text;
}

async function callGemini(prompt) {
  try {
    // Try fast Flash first
    return await generate(primaryModel, prompt);
  } catch (err) {
    console.warn("⚠️ Flash failed, switching to Pro:", err.message);
    return await generate(fallbackModel, prompt);
  }
}

module.exports = { callGemini };
