import mongoose from "mongoose";
import User from "../models/User.js";
import Post from "../models/Post.js";


// =============================
// GET ANY USER PROFILE
// =============================
export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid user ID" });

    const user = await User.findById(id)
      .select("-password")
      .populate("friends", "name username profilePicture");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ user: id })
      .populate("user", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.json({ user, posts });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =============================
// GET LOGGED-IN USER PROFILE
// =============================
export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId)
      return res.status(401).json({ message: "Not authorized" });

    const user = await User.findById(userId)
      .select("-password")
      .populate("friends", "name username profilePicture")
      .populate("friendRequests.sent", "name username profilePicture")
      .populate("friendRequests.received", "name username profilePicture");

    const posts = await Post.find({ user: userId })
      .populate("user", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.json({ user, posts });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =============================
// UPDATE PROFILE
// =============================
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const fields = [
      "name",
      "username",
      "bio",
      "location",
      "website",
      "profilePicture",
      "coverPhoto",
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =============================
// SEND FRIEND REQUEST
// =============================
export const sendFriendRequest = async (req, res) => {
  try {
    const requesterId = req.user._id;
    const { id: targetId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(targetId))
      return res.status(400).json({ message: "Invalid user ID" });

    if (requesterId.toString() === targetId)
      return res.status(400).json({ message: "Cannot send request to yourself" });

    const requester = await User.findById(requesterId);
    const target = await User.findById(targetId);

    if (!requester || !target)
      return res.status(404).json({ message: "User not found" });

    // Already friends?
    if (requester.friends.includes(targetId))
      return res.status(400).json({ message: "Already friends" });

    // Add to requests safely
    await User.findByIdAndUpdate(targetId, {
      $addToSet: { "friendRequests.received": requesterId }
    });

    await User.findByIdAndUpdate(requesterId, {
      $addToSet: { "friendRequests.sent": targetId }
    });

    res.json({ message: "Friend request sent" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =============================
// ACCEPT FRIEND REQUEST
// =============================
export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: requesterId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { "friendRequests.received": requesterId },
      $addToSet: { friends: requesterId }
    });

    await User.findByIdAndUpdate(requesterId, {
      $pull: { "friendRequests.sent": userId },
      $addToSet: { friends: userId }
    });

    const updatedUser = await User.findById(userId)
      .populate("friends", "name username profilePicture");

    res.json({
      message: "Friend request accepted",
      friends: updatedUser.friends
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =============================
// DECLINE FRIEND REQUEST
// =============================
export const declineFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: requesterId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { "friendRequests.received": requesterId }
    });

    await User.findByIdAndUpdate(requesterId, {
      $pull: { "friendRequests.sent": userId }
    });

    res.json({ message: "Friend request declined" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// =============================
// REMOVE FRIEND
// =============================
export const removeFriend = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: friendId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId }
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId }
    });

    res.json({ message: "Friend removed successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};