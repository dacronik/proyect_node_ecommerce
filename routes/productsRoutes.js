const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ProductController = require('../controllers/productsControllers')


// Configuración de multer para almacenar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único para cada archivo
    }
});

const upload = multer({ storage: storage });




router.get('/', ProductController.getAllProducts);

router.get('/:id', ProductController.getProductById);

// Añadir multer a la ruta de creación de productos
router.post('/',  upload.fields([{ name: 'image1' }, { name: 'image2' }]),(req,res,next) =>{
    console.log('Solicitud POST a /productos recibida');
    next(); // Llama al siguiente middleware (el controlador)
}, ProductController.createProduct);

router.put('/:id', ProductController.updateProduct);

router.delete('/:id', ProductController.deleteProduct);

module.exports = router;