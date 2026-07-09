const router = require("express").Router();
const Product = require("../models/Product");
const mongoose = require("mongoose");

// ======================
// 📦 GET ALL PRODUCTS
// Supports: ?search=&category=&sort=new&limit=10
// "sort=new" → newest first (used by New Arrivals)
// "limit"    → caps the number of results (e.g. 10 for New Arrivals)
// ======================
router.get("/", async (req, res) => {
  try {
    const { search = "", category = "All", sort, limit } = req.query;

    let filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category !== "All") {
      filter.category = category;
    }

    console.log("✅ Products API HIT");

    let query = Product.find(filter);

    // ✅ Sort newest-first when requested (New Arrivals)
    if (sort === "new") {
      query = query.sort({ createdAt: -1 });
    }

    // ✅ Cap results when a limit is provided
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      query = query.limit(parsedLimit);
    }

    const products = await query;
    res.json(products);

  } catch (err) {
    console.error("❌ GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// ======================
// 🔍 GET SINGLE PRODUCT (🔥 IMPORTANT FIX)
// ======================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    console.error("❌ GET PRODUCT BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================
// ➕ ADD PRODUCT (ADMIN)
// ======================
router.post("/", async (req, res) => {
  try {
    const { name, price, image, category, description } = req.body;

    // ✅ Basic validation
    if (!name || !price || !image || !category) {
      return res.status(400).json({
        message: "Name, price, image, and category are required",
      });
    }

    const newProduct = new Product({
      name,
      price,
      image,
      category,
      description,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (err) {
    console.error("❌ ADD PRODUCT ERROR:", err);
    res.status(500).json({ message: "Error adding product" });
  }
});

// ======================
// ✏️ UPDATE PRODUCT
// ======================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updated = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);

  } catch (err) {
    console.error("❌ UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Error updating product" });
  }
});

// ======================
// ❌ DELETE PRODUCT
// ======================
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });

  } catch (err) {
    console.error("❌ DELETE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;