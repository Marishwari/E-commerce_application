const express = require("express");
const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  deleteOrder,
} = require("../controllers/orderController");

const { protect, admin } = require("../middleware/authMiddleware");

// USER
router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// PAYMENT
router.put("/:id/pay", protect, updateOrderToPaid);

// ADMIN
router.get("/", protect, admin, getAllOrders);
router.delete("/:id", protect, admin, deleteOrder);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

module.exports = router;