const ProductService = require('../services/productsServices');
const CategoryService = require('../services/categoryServices');


const ViewsController = {
    renderHomePage: async (req, res) => {
        try {
            const products = await ProductService.getAllProducts();
            const categories = await CategoryService.getAllCategories();
            
            // Agrupar los productos por categoría
            const groupedProducts = categories.map(category =>{
                return {
                    category: category.name,
                    products: products.filter(product => product.categoryId === category.id)
                }
            })

            

            res.status(200).render('index', {groupedProducts})
        } catch (error) {
            console.error('Error al renderizar la página de inicio:', error.message);
            res.status(500).render('error', { message: 'Ocurrió un error al cargar la página de inicio.' });            
        }
    },
    renderProductPage: async (req, res) => {
        try {
            const products = await ProductService.getAllProducts();
            const categories = await CategoryService.getAllCategories()
            const groupedProducts = categories.map(category => {
                return{
                    category: category.name,
                    products: products.filter(product => product.categoryId === category.id)
                }
            })
            res.status(200).render('productos',{
                products,
                categories,
                groupedProducts,
                product: products.find(product => product.id === parseInt(req.params.productId))
            })
        } catch (error) {
            console.error('Error al renderizar la página de productos:', error.message);
            res.status(500).render('error', { message: 'Ocurrió un error al cargar la página de productos.' });
        }
    },
    renderProductDetails: async (req,res) => {
        try {
            const productId = req.params.id
            const product = await ProductService.getProductById(productId)

            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            };
            //Obtener la Categoría 
            const category = await CategoryService.getCategoryById(product.categoryId)
            const productDetails = {
                id: product.id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                description: product.description,
                imagen1:product.imagen1,
                category: category.name
            }
            return res.status(200).json(productDetails);
        } catch (error) {
            console.error('Error al obtener los detalles del producto:', error.message);
            res.status(500).json({ message: 'Ocurrió un error al obtener los detalles del producto' });
        }
    },
}
module.exports = ViewsController