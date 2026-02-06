import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendRequest, acceptRequest } from "../controllers/friendController.js";

const router = express.Router();

router.put("/send/:id", protect, sendRequest);     // send friend request
router.put("/accept/:id", protect, acceptRequest); // accept friend request

export default router;
