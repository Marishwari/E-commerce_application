const express = require("express");
const Wishlist = require("../models/Wishlist");
const {protect} = require("../middleware/authMiddleware");

const router = express.Router();

// ADD TO WISHLIST
router.post("/add", protect, async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, name, image, price } = req.body;

    let wishlist = await Wishlist.findOne({
      user: userId,
    });

    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [],
      });
    }

    const alreadyExists = wishlist.products.find(
      (item) =>
        item.productId.toString() === productId
    );

    if (!alreadyExists) {
      wishlist.products.push({
        productId,
        name,
        image,
        price,
      });
    }

    await wishlist.save();

    res.status(200).json(wishlist);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET WISHLIST
router.get("/", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    res.json(wishlist?.products || []);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// REMOVE FROM WISHLIST
router.delete("/:id", protect, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      user: req.user._id,
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (item) =>
        item.productId.toString() !== req.params.id
    );

    await wishlist.save();

    res.json({
      message: "Removed from wishlist",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;