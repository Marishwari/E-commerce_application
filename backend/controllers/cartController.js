const Cart = require("../models/Cart");

// ============================================
// GET USER CART
// ============================================
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // CREATE EMPTY CART
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    res.status(200).json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
};

// ============================================
// ADD TO CART
// ============================================
exports.addToCart = async (req, res) => {
  try {
    const {
      productId,
      name,
      image,
      price,
    } = req.body;

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    // CREATE NEW CART
    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
      });
    }

    // FIND EXISTING ITEM
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() ===
        productId
    );

    if (existingItem) {
      existingItem.qty += 1;

    } else {
      cart.items.push({
        productId,
        name,
        image,
        price: Number(price),
        qty: 1,
      });
    }

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Add to cart failed",
    });
  }
};

// ============================================
// UPDATE QUANTITY
// ============================================
exports.updateQty = async (req, res) => {
  try {
    const {
      productId,
      qty,
    } = req.body;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.productId.toString() ===
        productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // REMOVE IF QTY <= 0
    if (qty <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          item.productId.toString() !==
          productId
      );

    } else {
      item.qty = Number(qty);
    }

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Update quantity failed",
    });
  }
};

// ============================================
// REMOVE ITEM
// ============================================
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.productId.toString() !==
        productId
    );

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Remove item failed",
    });
  }
};

// ============================================
// CLEAR CART
// ============================================
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Clear cart failed",
    });
  }
};