const router = require("express").Router();

const {
  registerUser,
  loginUser,
  googleAuth,
  getUsers,
  deleteUser,
  makeAdmin,
  removeAdmin, // ✅ ADDED
  getUserStats,
  updateProfile,
  getMyProfile,
} = require("../controllers/authController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

// ======================
// 🔐 AUTH ROUTES
// ======================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);

// ======================
// 👤 PROFILE ROUTES
// ======================
router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateProfile);

// ======================
// 👥 ADMIN USER MANAGEMENT
// ======================
router.get("/users", protect, admin, getUsers);
router.delete("/users/:id", protect, admin, deleteUser);
router.put("/users/admin/:id", protect, admin, makeAdmin);
router.put("/users/demote/:id", protect, admin, removeAdmin); // ✅ FIXED: isAdmin → admin, removeAdmin imported

// ======================
// 📊 USER STATS
// ======================
router.get("/stats", protect, admin, getUserStats);

module.exports = router;