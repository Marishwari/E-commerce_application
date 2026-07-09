const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const wishlistRoutes=require('./routes/wishlistRoutes.js');
const paymentRoutes =require('./routes/paymentRoutes.js');
const orderRoutes =require('./routes/orderRoutes.js')
const app = express();

// ==============================
// ✅ CORS FIX (IMPORTANT)
// ==============================
app.use(
  cors({
    origin: "http://localhost:3000", // ✅ your frontend URL
    credentials: true,               // ✅ allow cookies/auth
  })
);

// ==============================
// ✅ Google Login Popup Fix
// ==============================
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

// ==============================
// ✅ Middlewares
// ==============================
app.use(express.json());

// ==============================
// ✅ MongoDB Connection
// ==============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));

// ==============================
// ✅ ROUTES
// ==============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
// ==============================
// ✅ Health Check Route
// ==============================
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// ==============================
// ❌ 404 Handler
// ==============================
app.use((req, res) => {
  res.status(404).json({ message: "Route Not Found" });
});

// ==============================
// ❌ Global Error Handler
// ==============================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server Error" });
});

// ==============================
// ✅ Start Server
// ==============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);