import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createStory, getStories } from "../controllers/storyController.js";

const router = express.Router();

router.post("/", protect, upload.single("media"), createStory); // create story
router.get("/", protect, getStories);                           // get active stories

export default router;
