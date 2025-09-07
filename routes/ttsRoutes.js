import { generateTTS } from "@controllers/ttsController.js";
import { Router } from "express";
const router = Router();

router.get("/", generateTTS)

export default router;