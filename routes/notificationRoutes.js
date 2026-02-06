import express from "express";
import protect from "../middleware/authMiddleware.js";
import { getNotifications, markAsRead } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);           // get all notifications
router.put("/read/:id", protect, markAsRead);        // mark notification as read

export default router;
