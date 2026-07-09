const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        name: String,

        qty: Number,

        image: String,

        price: Number,

        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],

    shippingAddress: {
      fullName: String,

      phone: String,

      address: String,

      city: String,

      postalCode: String,

      country: String,
    },

    paymentMethod: {
      type: String,
      default: "Razorpay",
    },

    paymentResult: {
      id: String,

      status: String,

      update_time: String,

      email_address: String,
    },

    itemsPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },

    paidAt: Date,
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

module.exports = Order;