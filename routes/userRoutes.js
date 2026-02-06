import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getUserProfile, updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", protect, getUserProfile);       // Get user profile
router.put("/", protect, updateUserProfile);       // Update logged-in user profile

export default router;
