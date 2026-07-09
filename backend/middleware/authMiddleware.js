const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==============================
// ✅ PROTECT ROUTES
// ==============================
const protect = async (req, res, next) => {
  try {

    let token;

    // ✅ GET TOKEN FROM HEADER
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ NO TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token",
      });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // ✅ FIND USER
    const user = await User.findById(decoded.id)
      .select("-password");

    // ❌ USER NOT FOUND
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ ATTACH USER TO REQUEST
    req.user = user;

    next();

  } catch (error) {

    console.error(
      "❌ Auth Middleware Error:",
      error.message
    );

    // JWT EXPIRED
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
      });
    }

    // INVALID TOKEN
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// ==============================
// ✅ ADMIN ONLY
// ==============================
const admin = (req, res, next) => {

  if (req.user && req.user.isAdmin) {
    next();

  } else {

    return res.status(403).json({
      success: false,
      message: "Admin access only",
    });
  }
};

// ==============================
// ✅ OPTIONAL AUTH
// ==============================
const optionalAuth = async (req, res, next) => {

  try {

    let token;

    // ✅ CHECK TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token = req.headers.authorization.split(" ")[1];

      // ✅ VERIFY
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // ✅ ATTACH USER
      req.user = await User.findById(decoded.id)
        .select("-password");
    }

    next();

  } catch (error) {

    console.log(
      "⚠️ Optional Auth Skipped:",
      error.message
    );

    // NEVER BLOCK REQUEST
    next();
  }
};

// ==============================
// ✅ EXPORTS
// ==============================
module.exports = {
  protect,
  admin,
  optionalAuth,
};