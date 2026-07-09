const mongoose = require("mongoose");

// Address sub-schema
const addressSchema = new mongoose.Schema({
  fullAddress: {
    type: String,
    default: ""
  },
  city: {
    type: String,
    default: ""
  },
  state: {
    type: String,
    default: ""
  },
  pincode: {
    type: String,
    default: ""
  },
  country: {
    type: String,
    default: "India"
  }
}, { _id: false });

// User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  address: {
    type: addressSchema,
    default: () => ({})
  },

  // Optional: user cart reference for linking with Cart collection
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    default: null
  },

  // Optional: phone number
  phone: {
    type: String,
    default: ""
  },

  // Optional: profile image URL
  avatar: {
    type: String,
    default: ""
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);