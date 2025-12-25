const Cart = require("../models/Cart.js");
const Product = require("../models/Product.js");

class CartController {
  async getCart(req, res) {
    try {
      const userId = req.user.id;

      let cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",
        select: "title price description",
      });

      if (!cart) {
        cart = await Cart.create({
          user: userId,
          products: [],
        });
      }
      return res.json(cart);
    } catch (error) {

    }
  }

  async addToCart(req, res) {
    try {
        const userId = req.user.id
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId)

        if(!product) {
            return res.status(404).json({
                message: "Товар не найден"
            })
        }

        const cart =  await Cart.findOne({
            user: userId,
        })

        if(!cart) {
            cart = new Cart({
                user: userId,
                products: []
            })
        }
    } catch (error) {
        
    }
  }
}
