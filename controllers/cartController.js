const Cart = require('../models/Cart.js');
const Product = require('../models/Product.js');

class CartController {

    async getCart(req, res) {
        try {
            const userId = req.user.id; 

            let cart = await Cart.findOne({ user: userId })
                .populate({ path: 'products.product', select: "title price description img" });

            if (!cart) {
                cart = await Cart.create({ user: userId, products: [] });
            }
            return res.json(cart);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async addToCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity = 1 } = req.body;
            const product = await Product.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Товара нет" });
            }
            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                cart = new Cart({ user: userId, products: [] });
            }



            const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);




            if (itemIndex > -1) {
                cart.products[itemIndex].quantity += quantity;
                cart.products[itemIndex].totalPrice = cart.products[itemIndex].quantity * product.price;
            } else {
                cart.products.push({
                    product: productId,
                    quantity: quantity,
                    totalPrice: quantity * product.price,
                    addedAt: new Date()
                });
            }

            await cart.save();
            return res.status(200).json(cart);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteFromCart(req, res) {
        try {
            const userId = req.user.id;
            const { productId } = req.params; 



            let cart = await Cart.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: "Корзины нет" });
            }



            cart.products = cart.products.filter(p => p.product.toString() !== productId);

            await cart.save();
            return res.status(200).json(cart);

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async updateCartItem(req, res) {
        try {
            const userId = req.user.id;
            const { productId, quantity } = req.body; 
            let cart = await Cart.findOne({ user: userId });
            const product = await Product.findById(productId);
            

            
            if (!cart || !product) {
                return res.status(404).json({ message: "Корзина или товар не найдены" });
            }



            const itemIndex = cart.products.findIndex(p => p.product.toString() === productId);




            if (itemIndex > -1) {
                if (quantity <= 0) {
                    cart.products.splice(itemIndex, 1);
                } else {
                    cart.products[itemIndex].quantity = quantity;
                    cart.products[itemIndex].totalPrice = quantity * product.price;
                }
                await cart.save();
                return res.status(200).json(cart);
            } else {
                return res.status(404).json({ message: "Товара нет в корзине" });
            }



        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async clearCart(req, res) {
        try {
            const userId = req.user.id;
            let cart = await Cart.findOne({ user: userId });
            



            if (cart) {
                cart.products = [];
                await cart.save();
            }
            

            
            return res.status(200).json({ message: "Корзина удалена" });
        } catch (error) {
             return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new CartController();