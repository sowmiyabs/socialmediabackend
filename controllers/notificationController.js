import Notification from "../models/Notification.js";

// GET NOTIFICATIONS
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user })
      .populate("from", "name username profilePicture")
      .populate("post", "text media")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK AS READ
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    notification.isRead = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
