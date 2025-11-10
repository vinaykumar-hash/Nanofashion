import { createClient } from '@supabase/supabase-js'
import dotenv from "dotenv";
dotenv.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

