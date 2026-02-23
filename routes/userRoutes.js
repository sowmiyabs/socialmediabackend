import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  getMyProfile,
  updateUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend
} from "../controllers/userController.js";

const router = express.Router();

// ----------------------
// Profile routes
// ----------------------
router.get("/me", protect, getMyProfile);         // Logged-in user's profile
router.get("/:id", protect, getUserProfile);      // Any user's profile by ID
router.put("/", protect, updateUserProfile);      // Update logged-in user profile

// ----------------------
// Friends routes
// ----------------------
// You no longer need separate getFriends route because
// getMyProfile / getUserProfile already return friends
router.post("/friends/send/:id", protect, sendFriendRequest);
router.post("/friends/accept/:id", protect, acceptFriendRequest);
router.post("/friends/decline/:id", protect, declineFriendRequest);
router.delete("/friends/:id", protect, removeFriend);

export default router;