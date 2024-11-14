const ProductService = require('../services/productsServices');
const CategoryService = require('../services/categoryServices');

const ProductController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await ProductService.getAllProducts();
            const categories = await CategoryService.getAllCategories();
            res.status(200).render('admin/productos',{products,categories});
            //res.status(200).json({products,category});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProductById: async (req, res) => {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    getProductByCategory: async (req,res) => {
        try {
            const products = await ProductService.getProductByCategory(req.params.categoryId);
            if (!products.length === 0) {
                return res.status(404).json({ message: 'No hay productos en esta categoría' });
            }
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            console.log('Cuerpo de la solicitud:', req.body);
            console.log('Archivos recibidos:', req.files);
            const { name, price, stock, categoryId,description } =req.body

            const category = await CategoryService.getCategoryById(categoryId);
            if (!category) {
                throw new Error('Categoría no válida');
            }
            const categoryName = category.name;
            console.log(categoryName)
            // Obtener las rutas de las imágenes
            const image1 = req.files['image1'] ? req.files['image1'][0].filename : null; // Ruta de la imagen1
            const image2 = req.files['image2'] ? req.files['image2'][0].filename : null; // Ruta de la imagen2

            // Log para verificar las rutas de las imágenes
            console.log('Ruta de imagen1:', image1);
            console.log('Ruta de imagen2:', image2);

            const productData = {
                name,
                price,
                stock,
                categoryId,
                categoryName,
                imagen1: image1, // Guarda la ruta
                imagen2: image2, // Guarda la ruta
                description
            };
            console.log(productData);

            const product = await ProductService.createProduct(productData);
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            await ProductService.updateProduct(req.params.id, req.body)
            res.status(200).json({message: 'Producto actualizado exitosamente'});
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: 'Error de validación', details: error.errors });
            }
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            await ProductService.deleteProduct(req.params.id);
            res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
}

module.exports = ProductController;