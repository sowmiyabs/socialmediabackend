import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // 1️⃣ Check all fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Check for existing email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already registered" });

    // 3️⃣ Check for existing username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create user
    const user = await User.create({ name, username, email, password: hashedPassword });

    // 6️⃣ Generate token
    const token = generateToken(user._id);

    // 7️⃣ Return user without password
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        friends: user.friends,
        friendRequests: user.friendRequests
      },
      token
    });

  } catch (error) {
    console.error("Registration error:", error);
    // Handle Mongo duplicate key error just in case
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email or username already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // 2️⃣ Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 3️⃣ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 4️⃣ Generate token
    const token = generateToken(user._id);

    // 5️⃣ Return user without password
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        coverPhoto: user.coverPhoto,
        friends: user.friends,
        friendRequests: user.friendRequests
      },
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
};