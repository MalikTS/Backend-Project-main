const Router = require('express');
const cartController = require('../controllers/cartController.js');
const authMiddleware = require('../middlewaree/authMiddleware.js'); 

const router = new Router();

router.get('/', authMiddleware, cartController.getCart);
router.post('/add', authMiddleware, cartController.addToCart);
router.delete('/remove/:productId', authMiddleware, cartController.deleteFromCart);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;