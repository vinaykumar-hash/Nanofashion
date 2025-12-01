import express from "express";
import {
  getArtstylePrompt
} from "../controllers/artStyleController.js";
import { getAllArtstyleNames } from "../controllers/getAllArtstyleNames.js";


const router = express.Router();

// GET all artstyle names
router.get("/artstyles", getAllArtstyleNames);

// GET prompt for a specific artstyle
router.get("/artstyles/:name", getArtstylePrompt);

export default router;
