import express from "express";
import dotenv from "dotenv";
import imageEditorRoutes from "./routes/imageEditorRoutes.js";



dotenv.config();

const app = express();
app.use(express.json());

// Basic health check
app.get("/", (req, res) => res.send("✅ Nano Banana API is running..."));

// Routes
app.use("/api/gemini", imageEditorRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
