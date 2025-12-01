
import { supabase } from "../config/supaBase.js";

export const getArtstylePrompt = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ success: false, error: "Missing artstyle name" });
    }

    const { data, error } = await supabase
      .from("artstyles")
      .select("prompt")
      .eq("name", name)
      .single();

    if (error) throw error;

    return res.json({ success: true, prompt: data.prompt });
  } catch (error) {
    console.error("Error fetching artstyle prompt:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
