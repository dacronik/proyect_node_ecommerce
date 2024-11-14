const Category = require('../models/Categories');


const CategoryService = {
    getAllCategories: async () => {
        try {
            const categories = await Category.findAll();
            return categories;
        } catch (error) {
            throw new Error(`Error al obtener las categorías: ${error.message}`);
        }
    },
    getCategoryById: async (id) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }
            return category;
        } catch (error) {
            throw new Error(`Error al obtener la categoría: ${error.message}`);
        }
    },
    createCategory: async (categoryData) => {
        try {

            // Verificar si ya existe una categoría con el mismo nombre
            const existingCategory = await Category.findOne({ where: { name: categoryData.name } });
            if (existingCategory) {
                throw new Error('Ya existe una categoría con el mismo nombre');
            }
            // Crear la nueva categoría
            const newCategory = await Category.create(categoryData);
            return newCategory;
        } catch (error) {
            throw new Error(`Error al crear la categoría: ${error.message}`);
        }
    },
    updateCategory: async (id, categoryData) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }
            await category.update(categoryData);
            return category;
        } catch (error) {
            throw new Error(`Error al actualizar la categoría: ${error.message}`);
        }
    },
    deleteCategory: async (id) => {
        try {
            const category = await Category.findByPk(id);
            if (!category) {
                throw new Error('Categoría no encontrada');
            }
            await category.destroy();
            return category;
        } catch (error) {
            throw new Error(`Error al eliminar la categoría: ${error.message}`);
        }
    }
};

module.exports = CategoryService;