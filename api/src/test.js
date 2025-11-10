// To run this code:
// npm install @google/genai mime dotenv fs

import { GoogleGenAI } from '@google/genai';
import mime from 'mime';
import { readFile, writeFile } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

function saveBinaryFile(fileName, content) {
  writeFile(fileName, content, 'utf8', (err) => {
    if (err) {
      console.error(`❌ Error writing file ${fileName}:`, err);
      return;
    }
    console.log(`✅ File ${fileName} saved successfully.`);
  });
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("❌ GEMINI_API_KEY not found in .env file.");
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey });

  // Pass CLI args
  const imagePath = process.argv[2]; // e.g. ./banana.png
  const textPrompt = process.argv[3] || "Describe this image in detail.";

  if (!imagePath) {
    console.error("❌ Please provide an image path as the first argument.");
    console.log("Example: node image_text_prompt.js ./banana.png 'Make this banana wear sunglasses'");
    process.exit(1);
  }

  // Read the image
  const imageMimeType = mime.getType(imagePath);
  const imageBuffer = await new Promise((resolve, reject) => {
    readFile(imagePath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  // Create the contents (text + image)
  const contents = [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: imageMimeType,
            data: imageBuffer.toString("base64"),
          },
        },
        {
          text: textPrompt,
        },
      ],
    },
  ];

  console.log(`🎨 Sending prompt: "${textPrompt}" with image: ${imagePath}`);

  const model = "gemini-2.5-flash-image-preview"; // or use 'gemini-1.5-flash' for text+image reasoning

  const response = await ai.models.generateContent({
    model,
    contents,
  });

  // Handle text + image output
  const candidate = response.candidates?.[0];
  if (!candidate) {
    console.error("❌ No response candidates received.");
    return;
  }

  const part = candidate.content.parts[0];

  if (part.inlineData) {
    // If model returns an image
    const fileExtension = mime.getExtension(part.inlineData.mimeType || '') || 'png';
    const buffer = Buffer.from(part.inlineData.data || '', 'base64');
    saveBinaryFile(`output.${fileExtension}`, buffer);
  } else if (part.text) {
    console.log("💬 Model Response:", part.text);
  }
}

main().catch(console.error);
