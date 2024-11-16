const CartController = require('../controllers/cartController');
const express = require('express');

const router = express.Router();
const { getTotalQuantity } = require('../utils/cartUtils'); 


router.get('/carrito', CartController.renderCart);
router.get('/carrito/total-quantity', (req, res) => {
    const cart = req.session.cart || [];
    const totalQuantity = getTotalQuantity(cart);
    res.json({ totalQuantity });
})
router.post('/carrito/add', CartController.addToCart);
router.delete('/carrito/remove', CartController.removeFromCart);
router.delete('/carrito/empty', CartController.emptyCart);
router.put('/carrito/update', CartController.updateFromCart);
router.get('/carrito/datos', (req,res) => {
    const cartProducts = req.session.cart || [];
    const sessionData = req.session;
    const totalQuantity = getTotalQuantity(cartProducts);
    const totalPrice = cartProducts.reduce((total,product) =>{
        return total + (product.price * product.quantity)
    },0)
    res.json({
        session: sessionData,
        cartProducts: cartProducts,
        totalQuantity: totalQuantity,
        totalPrice: totalPrice
    })
})

module.exports = router;