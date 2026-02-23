import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    // Create comment
    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      text,
    });

    // Add comment to post
    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    // 🔔 Create notification (if not commenting on own post)
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.author,      // receiver
        from: req.user._id,     // sender
        type: "comment",
        post: post._id,
      });
    }

    // Populate author before sending response
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "name username profilePic");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// LIKE / UNLIKE COMMENT
export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const userId = req.user._id;

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.likes.includes(userId)) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET COMMENTS BY POST
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId })
      .populate("author", "name username profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};