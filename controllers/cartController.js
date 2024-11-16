const { getTotalQuantity } = require('../utils/cartUtils'); 
const crypto = require('crypto');


const CartController = {
    renderCart: async (req, res) => {
        try {
            const cart = req.session.cart || [];

            const totalQuantity = getTotalQuantity(cart);
            res.render('carrito', { cart, totalQuantity });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    addToCart: async (req, res) => {
        try {
            
    
            const { productId, name, price, quantity, image } = req.body;
    
            
            if (!productId || !name || !price || !quantity || !image) {
                return res.status(400).send('Faltan datos');
            }
    
            // Asegurarse de que la sesión de carrito existe
            if (!req.session.cart) {
                req.session.cart = [];
                let buyOrder = crypto.randomBytes(6).toString('hex').toUpperCase();
                if (!buyOrder || !buyOrder.trim()) {
                    console.log('Error: El buyOrder es inválido:', buyOrder);
                    return res.status(400).send('Error: buyOrder es inválido');
                }
                req.session.buyOrder =  buyOrder;
                req.session.totalAmount = 0; 
            }

            if(!req.session.sessionId){
                req.session.sessionId = req.session.user?.userId || crypto.randomBytes(8).toString('hex').toUpperCase();
            }
    
            // Convertir los valores a los tipos adecuados
            const parsedPrice = parseFloat(price);  // Convertir el precio a número
            const parsedQuantity = parseInt(quantity);  // Convertir la cantidad a número
    
            // Verificar que las conversiones fueron correctas
            if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
                return res.status(400).send('Datos inválidos (precio o cantidad no válidos)');
            }
    
            const cart = req.session.cart;
    
            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.findIndex(item => item.productId === productId);
    
            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, incrementar la cantidad
                cart[existingProductIndex].quantity += parsedQuantity;
            } else {
                // Si el producto no está en el carrito, agregar un nuevo producto
                cart.push({
                    productId,
                    name,
                    price: parsedPrice,
                    quantity: parsedQuantity,
                    image,  
                });
            }
            //Actualizar el totalAmount de la sesión
            req.session.totalAmount = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
            req.session.cart = cart;  // Guardar el carrito actualizado en la sesión
    
            // Enviar respuesta con éxito
            res.status(200).json({ message: 'Producto agregado al carrito con éxito' });
    
        } catch (error) {
            console.error('Error al agregar al carrito:', error.message);
            res.status(500).json({ message: 'Ocurrió un error al agregar el producto al carrito' });
        }
    },
    
    // Actualizar la cantidad de productos
    updateFromCart: async (req, res) => {
        try {
            const { productId, quantity } = req.body;
            const parsedQuantity = parseInt(quantity);
    
            // Verificar que la cantidad es válida
            if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
                return res.status(400).send('Cantidad inválida');
            }
    
            // Verificar si el carrito existe en la sesión
            if (!req.session.cart) {
                return res.status(400).send('El carrito está vacío');
            }
    
            const cart = req.session.cart;
            
            // Verificar si el producto está en el carrito
            const productIndex = cart.findIndex(item => item.productId === productId);
    
            if (productIndex === -1) {
                return res.status(404).send('Producto no encontrado en el carrito');
            }
    
            // Actualizar la cantidad del producto en el carrito
            cart[productIndex].quantity = parsedQuantity;
    
            // Guardar el carrito actualizado en la sesión
            req.session.cart = cart;
    
            // Enviar respuesta con éxito
            res.status(200).json({ message: 'Cantidad actualizada correctamente' });
    
        } catch (error) {
            console.error('Error al actualizar el carrito:', error.message);
            res.status(500).json({ message: 'Ocurrió un error al actualizar la cantidad en el carrito' });
        }
    },
    removeFromCart: async (req, res) => {
        try {
            const { productId } = req.body;
            
            // Verificar si el carrito existe
            if (!req.session.cart) {
                return res.status(400).json({ message: 'El carrito está vacío' });
            }
    
            // Filtrar el producto a eliminar
            req.session.cart = req.session.cart.filter(product => product.productId !== productId);
    
            // Responder con éxito
            res.status(200).json({ message: 'Producto eliminado del carrito' });
        } catch (error) {
            console.error('Error al eliminar del carrito:', error.message);
            res.status(500).json({ message: 'Ocurrió un error al eliminar el producto del carrito' });
        }
    },
    emptyCart: async (req, res) => {
        try {
            // Vaciar el carrito en la sesión
            req.session.cart = [];
    
            // Responder con éxito
            res.status(200).json({ message: 'Carrito vaciado correctamente' });
        } catch (error) {
            console.error('Error al vaciar el carrito:', error.message);
            res.status(500).json({ message: 'Ocurrió un error al vaciar el carrito' });
        }
    },
    cartInfo: async (req, res) => {
        try {
            const { cart, user } =req.session;
            if (!cart || cart.length === 0) {
                return res.status(400).json({ message: 'El carrito está vacío' });
            }
            // Generamos un identificador único para la orden de compra (buy_order)
            const buyOrder = crypto.randomBytes(8).toString('hex').toUpperCase();

            // El session_id podría ser el userId del usuario
            const sessionId = user.userId;

            // Calculamos el total de la compra (amount)
            const totalAmount = cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2);

            req.session.buyOrder = buyOrder;
            req.session.sessionId = sessionId;
            req.session.totalAmount = totalAmount;
            return res.json({
                buyOrder,
                sessionId,
                totalAmount,
            });
        } catch (error) {
            console.error('Error al procesar la información del carrito:', error);
            return res.status(500).json({ message: 'Hubo un error al procesar la transacción. Intenta nuevamente.' });
        }
    }
}

module.exports = CartController;