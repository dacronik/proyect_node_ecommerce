const express = require('express');
const router = express.Router();
const webpayController = require('../controllers/webpay_plus');

const checkUserSession = require('../middlewares/checkUserSession')

router.get('/webpay_plus/create', webpayController.showCreate)
// Ruta para la transacción 
router.post('/webpay_plus/create',checkUserSession, webpayController.create);

// Ruta para obtener el resultado de la transacción
router.get('/webpay_plus/commit', webpayController.commit);


module.exports = router;