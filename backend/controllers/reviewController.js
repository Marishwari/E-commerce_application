const Review = require("../models/Review");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const mongoose = require("mongoose");

// ==============================
// ➤ GET REVIEWS
// ==============================
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);

  } catch (err) {
    console.error("❌ GET REVIEWS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

// ==============================
// ➤ ADD REVIEW (MULTIPLE IMAGES)
// ==============================
exports.addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    // 🔐 Validate product
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    // 🔐 Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be 1–5" });
    }

    // 🔐 At least comment or images required
    if (!comment && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        message: "Please add comment or images",
      });
    }

    // 🚫 Max 5 images
    if (req.files && req.files.length > 5) {
      return res.status(400).json({
        message: "Maximum 5 images allowed",
      });
    }

    let imageUrls = [];

    // ==============================
    // ☁️ Upload images (parallel)
    // ==============================
    if (req.files?.length) {
      imageUrls = await Promise.all(
        req.files.map((file) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { resource_type: "image" },
              (error, result) => {
                if (error) return reject(error);
                resolve(result.secure_url);
              }
            );

            streamifier.createReadStream(file.buffer).pipe(stream);
          });
        })
      );
    }

    // ==============================
    // 📝 CREATE REVIEW
    // ==============================
    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment: comment || "",
      images: imageUrls,
    });

    // ==============================
    // 👤 POPULATE USER
    // ==============================
    const populated = await review.populate("user", "name");

    res.status(201).json(populated);

  } catch (err) {
    console.error("❌ ADD REVIEW ERROR:", err);
    res.status(500).json({ message: "Failed to add review" });
  }
};
// ==============================
// ➤ UPDATE REVIEW
// ==============================
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // ✅ ONLY OWNER OR ADMIN
    const isOwner =
      review.user.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    review.comment =
      req.body.comment || review.comment;

    // optional rating update
    if (req.body.rating) {
      review.rating = req.body.rating;
    }

    await review.save();

    const updatedReview = await Review.findById(
      review._id
    ).populate("user", "name");

    res.json(updatedReview);

  } catch (err) {
    console.error("❌ UPDATE REVIEW ERROR:", err);

    res.status(500).json({
      message: "Failed to update review",
    });
  }
};

// ==============================
// ➤ DELETE REVIEW
// ==============================
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    // ✅ ONLY OWNER OR ADMIN
    const isOwner =
      review.user.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    // ==============================
    // ☁️ DELETE CLOUDINARY IMAGES
    // ==============================
    if (review.images?.length) {
      for (const image of review.images) {
        try {
          // if stored as full URL skip safely
          if (typeof image !== "string") continue;

          const parts = image.split("/");
          const fileName =
            parts[parts.length - 1];

          const publicId =
            fileName.split(".")[0];

          await cloudinary.uploader.destroy(
            publicId
          );
        } catch (err) {
          console.log(
            "Cloudinary delete failed:",
            err.message
          );
        }
      }
    }

    await review.deleteOne();

    res.json({
      message: "Review deleted successfully",
    });

  } catch (err) {
    console.error("❌ DELETE REVIEW ERROR:", err);

    res.status(500).json({
      message: "Failed to delete review",
    });
  }
};