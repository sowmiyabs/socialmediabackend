import Story from "../models/Story.js";
import cloudinary from "../config/cloudinary.js";

// CREATE STORY
export const createStory = async (req, res) => {
  try {
    let mediaUrl = "";
    let mediaType = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "social_media/stories" });
      mediaUrl = result.secure_url;
      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
    }

    const story = await Story.create({
      author: req.user,
      media: { url: mediaUrl, type: mediaType },
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h expiry
    });

    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ACTIVE STORIES
export const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate("author", "name username profilePicture")
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
