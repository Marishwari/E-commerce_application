const User = require("../models/User");
const Order = require("../models/orderModel"); // ✅ ADD
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

// 🔐 Google Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ======================
// 🔑 GENERATE JWT TOKEN
// ======================
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ======================
// 📝 REGISTER USER
// ======================
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      isAdmin: user.isAdmin || false,
      address: user.address || {},
      avatar: user.avatar || "",
      cart: user.cart || null,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Register Error:", error.message);

    res.status(500).json({
      message: "Server error during registration",
    });
  }
};

// ======================
// 🔐 LOGIN USER
// ======================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // ✅ ORDER COUNT
    const orderCount = await Order.countDocuments({
      user: user._id,
    });

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      isAdmin: user.isAdmin || false,
      address: user.address || {},
      avatar: user.avatar || "",
      cart: user.cart || null,
      orders: orderCount,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      message: "Server error during login",
    });
  }
};

// ======================
// 🌐 GOOGLE AUTH
// ======================
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "No credential received",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({
        message: "Invalid Google token",
      });
    }

    const { name, email, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "googleAuth",
        avatar: picture || "",
      });
    }

    // ✅ ORDER COUNT
    const orderCount = await Order.countDocuments({
      user: user._id,
    });

    res.status(200).json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      isAdmin: user.isAdmin || false,
      address: user.address || {},
      avatar: user.avatar || "",
      cart: user.cart || null,
      orders: orderCount,
      createdAt: user.createdAt,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Google Auth Error:", error.message);

    res.status(500).json({
      message: "Google authentication failed",
    });
  }
};

// ======================
// 👤 GET MY PROFILE
// ======================
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ COUNT ORDERS
    const orderCount = await Order.countDocuments({
      user: user._id,
    });

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      isAdmin: user.isAdmin,
      address: user.address || {},
      avatar: user.avatar || "",
      cart: user.cart || null,
      orders: orderCount,
      createdAt: user.createdAt,
    });

  } catch (error) {
    console.error("Get Profile Error:", error.message);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ======================
// 👤 UPDATE PROFILE
// ======================
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      avatar,
    } = req.body;

    // ✅ GET LOGGED USER
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ UPDATE BASIC INFO
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.avatar = avatar || user.avatar;

    // ✅ UPDATE ADDRESS
    if (address) {
      user.address = {
        fullAddress:
          address.fullAddress ||
          user.address.fullAddress,

        city:
          address.city ||
          user.address.city,

        state:
          address.state ||
          user.address.state,

        pincode:
          address.pincode ||
          user.address.pincode,

        country:
          address.country ||
          user.address.country ||
          "India",
      };
    }

    const updatedUser = await user.save();

    // ✅ COUNT ORDERS
    const orderCount = await Order.countDocuments({
      user: updatedUser._id,
    });

    res.json({
      success: true,
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || "",
      isAdmin: updatedUser.isAdmin,
      address: updatedUser.address || {},
      avatar: updatedUser.avatar || "",
      cart: updatedUser.cart || null,
      orders: orderCount,
      createdAt: updatedUser.createdAt,
      token: generateToken(updatedUser._id),
    });

  } catch (err) {
    console.error(
      "Update Profile Error:",
      err.message
    );

    res.status(500).json({
      message: "Error updating profile",
    });
  }
};

// ======================
// 📊 USER STATS
// ======================
exports.getUserStats = async (req, res) => {
  try {

    const users = await User.countDocuments();

    const admins = await User.countDocuments({
      isAdmin: true,
    });

    const orders = await Order.countDocuments();

    res.json({
      users,
      admins,
      orders,
    });

  } catch (err) {
    console.error("Stats Error:", err.message);

    res.status(500).json({
      message: "Error fetching stats",
    });
  }
};

// ======================
// 👥 GET ALL USERS
// ======================
exports.getUsers = async (req, res) => {
  try {

    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {
    console.error(
      "Fetch Users Error:",
      err.message
    );

    res.status(500).json({
      message: "Error fetching users",
    });
  }
};

// ======================
// ❌ DELETE USER
// ======================
exports.deleteUser = async (req, res) => {
  try {

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User deleted ✅",
    });

  } catch (err) {
    console.error(
      "Delete User Error:",
      err.message
    );

    res.status(500).json({
      message: "Error deleting user",
    });
  }
};

// ======================
// 🛡️ MAKE ADMIN
// ======================
exports.makeAdmin = async (req, res) => {
  try {

    const user = await User.findById(
      req.params.id
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isAdmin = true;

    await user.save();

    res.json({
      success: true,
      message: "User promoted to admin ✅",
    });

  } catch (err) {
    console.error(
      "Make Admin Error:",
      err.message
    );

    res.status(500).json({
      message: "Error updating user",
    });
  }
};

// ======================
// 🔽 REMOVE ADMIN
// ======================
exports.removeAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = false;
    await user.save();

    res.json({ success: true, message: "Admin access removed" });
  } catch (err) {
    console.error("Remove Admin Error:", err.message);
    res.status(500).json({ message: "Error updating user" });
  }
};