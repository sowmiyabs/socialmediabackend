import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  media: { url: String, type: String },
  expiresAt: Date
}, { timestamps: true });

export default mongoose.model("Story", storySchema);
