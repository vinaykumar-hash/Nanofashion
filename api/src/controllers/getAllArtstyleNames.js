import { supabase } from "../config/supaBase.js";

export const getAllArtstyleNames = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("artstyles")
      .select("name")
      .order("name", { ascending: true });

    if (error) throw error;

    return res.json({ success: true, styles: data });
  } catch (error) {
    console.error("Error fetching artstyle names:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
