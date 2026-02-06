import User from "../models/User.js";

// SEND FRIEND REQUEST
export const sendRequest = async (req, res) => {
  try {
    const sender = await User.findById(req.user);
    const receiver = await User.findById(req.params.id);

    if (!receiver) return res.status(404).json({ message: "User not found" });

    if (!sender.friendRequests.sent.includes(receiver._id)) {
      sender.friendRequests.sent.push(receiver._id);
      receiver.friendRequests.received.push(sender._id);
      await sender.save();
      await receiver.save();
    }

    res.json({ message: "Friend request sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ACCEPT FRIEND REQUEST
export const acceptRequest = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    const sender = await User.findById(req.params.id);

    user.friends.push(sender._id);
    sender.friends.push(user._id);

    user.friendRequests.received.pull(sender._id);
    sender.friendRequests.sent.pull(user._id);

    await user.save();
    await sender.save();

    res.json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
