const ViewsController = require('../controllers/viewsControllers');
const express = require('express');
const router = express.Router()

// Ruta Principal 
router.get('/', ViewsController.renderHomePage);

// Ruta de productos
router.get('/productos', ViewsController.renderProductPage);

// Ruta productos por ID 
router.get('/productos/detalles/:id', ViewsController.renderProductDetails);


module.exports = router;