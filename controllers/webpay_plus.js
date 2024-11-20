const { WebpayPlus } = require('transbank-sdk');
const asyncHandler = require('../utils/asyncHandler');
const ProductService = require('../services/productsServices');
const { sendTransactionEmail} = require('../services/emailService')
const crypto = require('crypto');

// Muestra la vista de confirmación antes de crear la transacción
exports.showCreate = asyncHandler(async (req, res) => {
    // Obtener datos necesarios desde la sesión
    const buyOrder = req.session.buyOrder || '';
    const sessionId = req.session.sessionId || '';
    const amount = req.session.totalAmount || 0;

    // Validar que los valores existan
    if (!buyOrder || !sessionId || amount <= 0) {
        return res.status(400).send('Error: Datos de la transacción no válidos.');
    }

    // Renderizar la vista de confirmación
    res.render('webpay_plus/create', {
        buyOrder,
        sessionId,
        amount
    });
});
// Crea la transacción con Webpay Plus
exports.create = asyncHandler(async (req, res) => {
    const buyOrder = String(req.session.buyOrder || '');
    const sessionId = String(req.session.sessionId || '');
    const amount = req.session.totalAmount || 0;
    const returnUrl = `${req.protocol}://${req.get('host')}/webpay_plus/commit`;

    // Validación básica
    if (!buyOrder || !sessionId || amount <= 0) {
        return res.status(400).send('Error: Datos de la transacción no válidos.');
    }

    // Crear la transacción con Webpay Plus
    const createResponse = await new WebpayPlus.Transaction().create(
        buyOrder,
        sessionId,
        amount,
        returnUrl
    );

    // Redirigir al usuario a Webpay
    res.redirect(`${createResponse.url}?token_ws=${createResponse.token}`);
});


//Confirmar transacción
exports.commit = asyncHandler(async (req, res) => {
    const token = req.query.token_ws || req.body.token_ws;

    if (!token) {
        return res.status(400).send('Token de transacción inválido');
    }

   
    const commitResponse = await new WebpayPlus.Transaction().commit(token);

    if (commitResponse.status === 'AUTHORIZED') {
        const user = req.session.user;
        const cart = req.session.cart;
        const totalAmount = req.session.totalAmount || 0;

        //Enviar email
        await sendTransactionEmail(user.email,{
            buyOrder: req.session.buyOrder,
            totalAmount,
            cart
        })

        
        if (cart && Array.isArray(cart) && cart.length > 0) {
            try {
                
                for (const item of cart) {
                    const { productId, quantity } = item;

                    if (!productId || !quantity) {
                        throw new Error('Datos del producto no válidos en el carrito');
                    }

                    
                    await ProductService.updateProductStock(productId, quantity);
                    
                }
                req.session.cart = [];

                
                req.session.buyOrder = crypto.randomBytes(6).toString('hex').toUpperCase();
            } catch (error) {
                
                console.error('Error al actualizar el stock:', error);
                return res.status(500).json({ message: 'Error al actualizar el stock de los productos' });
            }
        }

        
        res.render("webpay_plus/commit", {
            token,
            commitResponse
        });
    } else {
        
        res.render("webpay_plus/commit", {
            token,
            commitResponse
        });
    }
});
