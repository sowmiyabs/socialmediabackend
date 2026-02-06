import Comment from "../models/Comment.js";
import Post from "../models/Post.js";

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.postId;

    const comment = await Comment.create({
      post: postId,
      author: req.user._id,
      text
    });

    const post = await Post.findById(postId);
    post.comments.push(comment._id);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIKE / UNLIKE COMMENT
export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const userId = req.user._id;

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
      .populate("author", "name username")
      .sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
