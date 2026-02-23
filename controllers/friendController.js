import User from "../models/User.js";

// SEND FRIEND REQUEST
export const sendRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.user);
    const receiver = await User.findById(req.params.id);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    // Prevent sending request to self
    if (sender._id.equals(receiver._id)) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    // Check if already friends
    if (sender.friends.includes(receiver._id)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Prevent duplicate requests
    if (!sender.friendRequests.sent.includes(receiver._id)) {
      sender.friendRequests.sent.push(receiver._id);
    }
    if (!receiver.friendRequests.received.includes(sender._id)) {
      receiver.friendRequests.received.push(sender._id);
    }

    await sender.save();
    await receiver.save();

    res.json({ message: "Friend request sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ACCEPT FRIEND REQUEST
export const acceptRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const sender = await User.findById(req.params.id);

    if (!sender) return res.status(404).json({ message: "User not found" });

    // Prevent adding duplicate friends
    if (!user.friends.includes(sender._id)) user.friends.push(sender._id);
    if (!sender.friends.includes(user._id)) sender.friends.push(user._id);

    // Remove from friend requests
    user.friendRequests.received.pull(sender._id);
    sender.friendRequests.sent.pull(user._id);

    await user.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
