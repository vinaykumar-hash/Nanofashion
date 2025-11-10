import { supabase } from "../config/supaBase.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Saves a generated image buffer to Supabase Storage and logs metadata.
 * @param {Buffer} buffer - The image buffer data.
 * @param {string} mimeType - The image MIME type (e.g., image/png).
 * @param {string} requestId - The unique ID sent with the POST request.
 * @param {string} prompt - The generation prompt.
 * @returns {Promise<string>} Public URL of uploaded image.
 */
export async function saveImageToSupabase(buffer, mimeType, requestId, prompt) {
  try {
    const fileExt = mimeType.split("/")[1] || "png";
    const fileName = `${requestId}_${Date.now()}.${fileExt}`;
    const filePath = `generated/${fileName}`;

    // Upload image to the Supabase Storage bucket
    const { data, error: uploadError } = await supabase.storage
      .from("generated-images")
      .upload(filePath, buffer, {
        contentType: mimeType,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: publicData } = supabase.storage
      .from("generated-images")
      .getPublicUrl(filePath);

    const publicUrl = publicData.publicUrl;

    // Insert metadata into DB table
    const { error: dbError } = await supabase.from("generated_images").insert([
      {
        request_id: requestId,
        image_url: publicUrl,
        prompt,
      },
    ]);

    if (dbError) throw dbError;

    console.log(`✅ Image uploaded and logged: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error("❌ Error saving image to Supabase:", error.message);
    throw error;
  }
}