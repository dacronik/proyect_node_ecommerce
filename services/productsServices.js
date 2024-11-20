const Category = require('../models/Categories');
const Product = require('../models/Products');

const ProductService = {
    getAllProducts: async () => {
        try {
            const products = await Product.findAll({
                include: {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            });
            return products;
        } catch (error) {
            throw new Error(`Error al obtener los productos: ${error.message}`);
        }
    },
    getProductById: async (id) => {
        try {
            const product = await Product.findByPk(id,{
                include: {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
                }
            });
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            return product;
        } catch (error) {
            throw new Error(`Error al obtener el producto: ${error.message}`);
        }
    },
    getProductByCategory: async (categoryId) => {
        try {
            const products = await Product.findAll({ 
                where: { categoryId },
                include: {
                    model: Category,
                    as: 'category',
                    attributes: ['name']
            }});
            if (!products.length) {
                throw new Error('No hay productos en esta categoría');
            }
            return products;
        } catch (error) {
            throw new Error(`Error al obtener productos por categoría: ${error.message}`);
        }
    },
    createProduct: async (productData) => {
        try {
            const existingProduct = await Product.findOne({ where: { name: productData.name}});

            if (existingProduct) {
                throw new Error('El producto ya existe');
            };
            const { name, price, stock, categoryId,category, imagen1, imagen2, description } = productData;

            if (!name || !price || !stock || !categoryId || !imagen1 ) {
                throw new Error('Faltan datos necesarios para crear el producto');
            }
            const newProduct = await Product.create({
                name,
                price,
                stock,
                categoryId,
                category,
                imagen1, // Ruta de la imagen1
                imagen2,
                description // Ruta de la imagen2
            });

            console.log(newProduct);
            return newProduct;
        } catch (error) {
            console.error('Error en el servicio al crear el producto:', error); // Log para errores
            throw new Error(`Error al crear el producto: ${error.message}`);
        }
    },
    updateProduct: async (id, productData) => {
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            await product.update(productData);
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar el producto: ${error.message}`)
        }
    },
    deleteProduct: async (id) => {
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            await product.destroy();
        } catch (error) {
            throw new Error(`Error al eliminar el producto: ${error.message}`);
        }
    },
    updateProductStock: async (id, quantity) => {
        try {
            const product = await Product.findByPk(id);
            if (!product) {
                throw new Error('Producto no encontrado');
            }
            if (product.stock < quantity) {
                throw new Error('Stock insuficiente para completar la compra');
            }
            // Restar el stock
            product.stock -= quantity;
            await product.save();
            return product;
        } catch (error) {
            throw new Error(`Error al actualizar el stock del producto: ${error.message}`);
        }
    }
};

module.exports = ProductService;