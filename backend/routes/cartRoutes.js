const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateQty,
  removeItem,
  clearCart,
} = require("../controllers/cartController");

// ============================================
// ROUTES
// ============================================

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.put("/update", protect, updateQty);

router.delete(
  "/remove/:productId",
  protect,
  removeItem
);

router.delete(
  "/clear",
  protect,
  clearCart
);

module.exports = router;