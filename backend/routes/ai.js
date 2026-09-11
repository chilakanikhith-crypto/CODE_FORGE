import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

router.post("/", async (req, res) => {
    try {

        const { question, campusData } = req.body;

        const prompt = `
You are the AI Assistant of GRIET INTELLIGENT CAMPUS.

Campus Data:
${JSON.stringify(campusData, null, 2)}

Question:
${question}

Answer professionally in a short and clear way.
`;

        const response = await ai.models.generateContent({
            model: process.env.MODEL,
            contents: prompt,
        });

        res.json({
            reply: response.text,
        });

    } catch (error) {
  console.error("========== GEMINI ERROR ==========");
  console.error(error);

  if (error.response) {
    console.error(error.response.data);
  }

  res.status(500).json({
    reply: "AI Server Error",
    details: error.message,
  });
}
});

export default router;