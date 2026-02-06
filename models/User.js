import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: { type: String, unique: true },
  password: String,
  bio: String,
  profilePicture: String,
  coverPhoto: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequests: {
    sent: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    received: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
