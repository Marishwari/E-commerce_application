const express = require("express");
const router = express.Router();

const {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// ==============================
// ➤ GET REVIEWS
// ==============================
router.get("/:productId", getReviews);

// ==============================
// ➤ ADD REVIEW (MULTIPLE IMAGES)
// ==============================
router.post(
  "/",
  protect,

  // ✅ HANDLE MULTER ERRORS PROPERLY
  (req, res, next) => {
    upload.array("images", 5)(req, res, function (err) {
      if (err) {
        console.error("❌ Multer Error:", err.message);

        return res.status(400).json({
          message: err.message || "Image upload failed",
        });
      }

      next();
    });
  },

  addReview
);
// ==============================
// ➤ UPDATE REVIEW
// ==============================
router.put(
  "/:id",
  protect,
  updateReview
);

// ==============================
// ➤ DELETE REVIEW
// ==============================
router.delete(
  "/:id",
  protect,
  deleteReview
);
module.exports = router;