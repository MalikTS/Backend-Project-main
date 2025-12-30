const { Schema, model, default: mongoose } = require("mongoose");


const Basket = new mongoose.Schema({
  ProductID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  quantity: { type: Number, require: true, min: 1, default: 1 },
  price: { type: Number, require: true },
});

module.exports = mongoose.model("Basket", Basket);
