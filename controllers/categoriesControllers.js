const CategoryService = require('../services/categoryServices');


const CategoryControllers ={
    getAllCategories: async (req,res) => {
        try {
            const categories = await CategoryService.getAllCategories();
            res.status(200).render('admin/categorias',{categories})
        } catch (error) {
            res.status(500).render('admin/categorias',{ message: error.message });
        }
    },
    getCategoriesById: async (req, res) => {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if(!category){
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            res.status(200).json(category);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            const category = await CategoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error) {
            if( error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: 'Error de validación al intentar crear una categoría', details: error.errors });
            }
            res.status(500).json({ error: 'Error interno del servidor al intentar crear una categoría', details: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if(!category){
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            await CategoryService.updateCategory(req.params.id, req.body);
            res.status(200).json({category, message:'Categoría actualizada correctamente'});
        } catch (error) {
            console.error(error);
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).json({ error: 'Error de validación al intentar actualizar una categoría', details: error.errors });
            }
            res.status(500).json({ error: 'Error interno del servidor al intentar actualizar una categoría', details: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if(!category){
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            await CategoryService.deleteCategory(req.params.id);
            res.status(200).json({ message: 'Categoría eliminada correctamente' });
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor al intentar eliminar una categoría', details: error.message });
        }
    }
};

module.exports = CategoryControllers;