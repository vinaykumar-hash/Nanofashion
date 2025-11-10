import express from "express";
import { editImage } from "../controllers/ImageEditorController.js";

const router = express.Router();

// POST /api/gemini/edit-image
router.post("/edit-image", editImage);

export default router;
