import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// ----------------------
// CREATE POST
// ----------------------
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const media = [];

    // Check if files exist
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "social_media/posts",
          });

          media.push({
            url: result.secure_url,
            type: file.mimetype.startsWith("video") ? "video" : "image",
          });
        } catch (cloudErr) {
          console.error("Cloudinary upload error:", cloudErr);
        } finally {
          // Remove temp file
          if (fs.existsSync(file.path)) {
            await fs.promises.unlink(file.path);
          }
        }
      }
    }

    // Validate: post cannot be empty
    if ((!text || text.trim() === "") && media.length === 0) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    // Create post
    const post = await Post.create({
      author: req.user._id,
      text,
      media,
    });

    // Populate author info
    const populatedPost = await post.populate(
      "author",
      "name username profilePicture"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// GET FEED (User + Friends)
// ----------------------
export const getFeed = async (req, res) => {
  try {
    // Fetch all posts (you can later filter by user + friends)
    const posts = await Post.find()
      .populate("author", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Get Feed Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ----------------------
// LIKE / UNLIKE POST
// ----------------------
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id.toString();

    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // Unlike
    } else {
      post.likes.push(userId); // Like
    }

    await post.save();

    const populatedPost = await post.populate(
      "author",
      "name username profilePicture"
    );

    res.json(populatedPost);
  } catch (error) {
    console.error("Like Post Error:", error);
    res.status(500).json({ message: error.message });
  }
};