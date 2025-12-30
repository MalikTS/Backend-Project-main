const { Schema, model, default: mongoose } = require("mongoose");


const Cart = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
    unique: true,
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
        default: 1,
        min: 1,
      },
      addeAt: {
        type: Date,
        default: Date.now,
      },
      totalPrice: {
        type: Number,
        default: 0,
      },
      totalItems: {
        type: Number,
        default: 0,
      },
      updateAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = mongoose.model("Cart", Cart);
