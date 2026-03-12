import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";
import path from "path";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();
connectDB();

const app = express();

// -----------------------------
// Ensure uploads folder exists
// -----------------------------
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log("✅ Created uploads folder");
}

// -----------------------------
// Middleware
// -----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for React app
app.use(cors({
  origin: "http://localhost:5174", // your React dev server
  credentials: true,               // allows cookies or auth headers
}));

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// -----------------------------
// API Routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/notifications", notificationRoutes);

// -----------------------------
// Health Check
// -----------------------------
app.get("/", (req, res) => res.send("🚀 Social Media Backend Running"));

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));