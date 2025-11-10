// import { GoogleGenAI } from "@google/genai";
// import mime from "mime";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export const generateImage = async (req, res) => {
//   try {
//     const { prompt, images } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     // Config for image generation
//     const config = {
//       responseModalities: ["IMAGE", "TEXT"],
//       imageConfig: {
//         imageSize: "1K", // Options: 256, 512, 1K, 2K
//       },
//     };

//     const model = "gemini-2.5-flash-image";

//     // Build contents (prompt + optional images)
//     const contents = [
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ];

//     if (images?.length) {
//       const imageParts = await Promise.all(
//         images.map(async (url) => {
//           const response = await fetch(url);
//           const buffer = await response.arrayBuffer();
//           return {
//             inlineData: {
//               data: Buffer.from(buffer).toString("base64"),
//               mimeType: response.headers.get("content-type") || "image/jpeg",
//             },
//           };
//         })
//       );
//       contents[0].parts.push(...imageParts);
//     }

//     // Call the model stream API
//     const response = await ai.models.generateContentStream({
//       model,
//       config,
//       contents,
//     });

//     let resultImage = null;
//     let mimeType = null;
//     let text = "";

//     for await (const chunk of response) {
//       const parts = chunk?.candidates?.[0]?.content?.parts;
//       if (!parts) continue;

//       for (const part of parts) {
//         if (part.inlineData) {
//           resultImage = part.inlineData.data;
//           mimeType = part.inlineData.mimeType;
//         } else if (part.text) {
//           text += part.text;
//         }
//       }
//     }

//     if (!resultImage) {
//       return res.status(500).json({ error: "No image returned from model" });
//     }

//     res.json({
//       text,
//       imageBase64: resultImage,
//       mimeType,
//     });
//   } catch (error) {
//     console.error("Error generating image:", error);
//     res.status(500).json({
//       error: "Error generating image",
//       details: error.message,
//     });
//   }
// };
