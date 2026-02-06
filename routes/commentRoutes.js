import express from "express";
import protect from "../middleware/authMiddleware.js";
import { addComment, likeComment, getCommentsByPost } from "../controllers/commentController.js";

const router = express.Router();

// Add comment
router.post("/:postId", protect, addComment);

// Like/unlike comment
router.put("/like/:id", protect, likeComment);

// ✅ Get all comments for a post
router.get("/post/:postId", protect, getCommentsByPost);

export default router;
