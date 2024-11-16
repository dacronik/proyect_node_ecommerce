const express = require('express');
const router = express.Router();
const webpayController = require('../controllers/webpay_plus')

// Ruta para la transacción 
router.post('/webpay_plus/create', webpayController.create);

// Ruta para obtener el resultado de la transacción
router.get('/webpay_plus/commit', webpayController.commit);


module.exports = router;