import express from "express";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { createPost, getFeed, likePost } from "../controllers/postController.js";

const router = express.Router();

router.post("/", protect, upload.array("media", 10), createPost); // create post with multiple files
router.get("/", protect, getFeed);                                 // get feed
router.put("/:id/like", protect, likePost); // now matches frontend
                  // like/unlike post

export default router;
