const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  image: {
    type: String,
  },
  emoji: {
    type: String,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
    },
    items: [orderItemSchema],
    pricing: {
      subtotal: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
      promoCode: { type: String, default: "" },
    },
    payment: {
      method: {
        type: String,
        enum: ["card", "upi", "cod"],
        default: "card",
      },
      status: {
        type: String,
        enum: ["Paid", "Pending", "Cash on Delivery"],
        default: "Paid",
      },
      transactionId: {
        type: String,
        default: () => "TXN-" + Math.floor(100000 + Math.random() * 900000),
      },
    },
    status: {
      type: String,
      enum: ["Confirmed", "Processing", "Shipped", "Delivered"],
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
