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

            console.log({groupedProducts});

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
    }
}
module.exports = ViewsController