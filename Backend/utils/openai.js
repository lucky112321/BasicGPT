import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const getGeminiResponse = async (message) => {
    // Support both naming conventions just in case
    const apiKey = process.env.GEMINI_API_KEY || process.env.Gemini_API_KEY;

    if (!apiKey || apiKey.includes("PASTE_YOUR_KEY_HERE")) {
        throw new Error("Invalid or missing GEMINI_API_KEY in .env file. Please replace the placeholder with your actual key.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    try {
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
    } catch (err) {
        console.error("Gemini API Error:", err);
        throw err;
    }
};

export default getGeminiResponse;