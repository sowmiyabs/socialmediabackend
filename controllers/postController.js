import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const media = [];

    // Handle uploaded files
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "social_media/posts",
        });

        media.push({
          url: result.secure_url,
          type: file.mimetype.startsWith("video") ? "video" : "image",
        });
      }
    }

    const post = await Post.create({
      author: req.user, // req.user comes from protect middleware
      text,
      media,
    });

    const populatedPost = await post.populate("author", "name username profilePicture");
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// GET FEED (User + Friends)
export const getFeed = async (req, res) => {
  try {
    // You can later filter by user + friends only
    const posts = await Post.find()
      .populate("author", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// LIKE / UNLIKE POST
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.toString();

    if (post.likes.includes(userId)) {
      post.likes.pull(userId); // unlike
    } else {
      post.likes.push(userId); // like
    }

    await post.save();

    const populatedPost = await post.populate("author", "name username profilePicture");
    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
