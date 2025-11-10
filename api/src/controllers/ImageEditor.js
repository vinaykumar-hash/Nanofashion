import { GoogleGenAI } from "@google/genai";
import mime from "mime";
import { readFile } from "fs";
import dotenv from "dotenv";
import { saveImageToSupabase } from "../Utils/FileStorage.js";
import { model } from "../config/gemini.js";

dotenv.config();

/**
 * Generate a new image using Gemini based on input images + prompt.
 * @param {string[]} imagePaths - Array of image paths or URLs.
 * @param {string} prompt - Description or edit instruction for Gemini.
 * @returns {Promise<{ mimeType: string, base64Data: string }>} - The generated image data.
 */
export async function generate(imagePaths = [], prompt, requestId) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("❌ GEMINI_API_KEY not found in .env file.");

    const ai = new GoogleGenAI({ apiKey });

    const imageParts = await Promise.all(
      imagePaths.map(async (path) => {
        let buffer, mimeType;

        if (path.startsWith("http://") || path.startsWith("https://")) {
          const res = await fetch(path);
          const arrBuffer = await res.arrayBuffer();
          buffer = Buffer.from(arrBuffer);
          mimeType = res.headers.get("content-type") || "image/png";
        } else {
          mimeType = mime.getType(path);
          buffer = await new Promise((resolve, reject) => {
            readFile(path, (err, data) => (err ? reject(err) : resolve(data)));
          });
        }

        return {
          inlineData: {
            mimeType,
            data: buffer.toString("base64"),
          },
        };
      })
    );

    const contents = [
      { role: "user", parts: [...imageParts, { text: prompt }] },
    ];
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseModalities: ["IMAGE"],
        imageConfig: { imageSize: "1K" },
      },
    });
    
    const candidate = response.candidates?.[0];
    console.log(candidate.content)
    const part = candidate?.content?.parts?.[0];
    if (!part?.inlineData) throw new Error("No image returned from Gemini");

    const mimeType = part.inlineData.mimeType || "image/png";
    const buffer = Buffer.from(part.inlineData.data || "", "base64");

    // Save to Supabase instead of locally
    console.log(requestId)
    const publicUrl = await saveImageToSupabase(buffer, mimeType, requestId, prompt);

    return { publicUrl, mimeType };
  } catch (error) {
    console.error("❌ Error generating image:", error.message);
    throw error;
  }
}
