// import genAI from "../config/gemini.js";

// export const generateFromNano = async (req, res, next) => {
//   try {
//     const { prompt, images } = req.body;

//     if (!prompt) {
//       return res.status(400).json({ error: "Prompt is required" });
//     }

//     // Initialize model (use gemini-1.5-flash or gemini-nano depending on your API access)
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

//     // Convert image URLs to base64 (Nano and Gemini need inline images)
//     const imageParts = await Promise.all(
//       (images || []).map(async (url) => {
//         const response = await fetch(url);
//         const buffer = await response.arrayBuffer();
//         return {
//           inlineData: {
//             data: Buffer.from(buffer).toString("base64"),
//             mimeType: response.headers.get("content-type") || "image/jpeg",
//           },
//         };
//       })
//     );

//     // Send prompt + image parts
//     const result = await model.generateContent([
//       { text: prompt },
//       ...imageParts,
//     ]);

//     const text = result.response.text();

//     res.status(200).json({ output: text });
//   } catch (error) {
//     console.error("Gemini error:", error);
//     res.status(500).json({ error: "Something went wrong", details: error.message });
//   }
// };
