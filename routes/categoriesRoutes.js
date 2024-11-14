const express = require('express');
const router = express.Router();
const CategoryControllers = require('../controllers/categoriesControllers')

router.get('/', CategoryControllers.getAllCategories);

router.get('/:id', CategoryControllers.getCategoriesById);

router.post('/', CategoryControllers.createCategory);

router.put('/:id', CategoryControllers.updateCategory);

router.delete('/:id', CategoryControllers.deleteCategory);

module.exports = router;