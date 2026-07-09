const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,   // ⭐ validation
      max: 5,
    },

    comment: {
      type: String,
      default: "", // ✅ allow image-only reviews
    },

    // ✅ MULTIPLE IMAGES (max 5)
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (val) {
          return val.length <= 5;
        },
        message: "Maximum 5 images allowed",
      },
    },

    // ❤️ Likes
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);