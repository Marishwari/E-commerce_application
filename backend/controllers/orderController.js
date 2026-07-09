const Order = require("../models/orderModel");

// ======================
// CREATE ORDER
// ======================
exports.createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentResult,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentResult,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create Order Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// GET MY ORDERS
// ======================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get My Orders Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// GET ORDER BY ID
// ======================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // allow only owner or admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.json(order);
  } catch (error) {
    console.error("Get Order Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// UPDATE ORDER TO PAID
// ======================
exports.updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    order.paymentResult = {
      id: req.body.id || "manual",
      status: req.body.status || "paid",
      update_time: Date.now(),
      email_address: req.body.email_address || "",
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Update Payment Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// UPDATE ORDER TO DELIVERED (ADMIN)
// ======================
exports.updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error("Delivery Update Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// GET ALL ORDERS (ADMIN)
// ======================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Get All Orders Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// ======================
// DELETE ORDER (ADMIN)
// ======================
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    console.error("Delete Order Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};