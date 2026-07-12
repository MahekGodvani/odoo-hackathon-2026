const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isManager, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, categoryController.getCategories);
router.post('/', verifyToken, isManager, categoryController.createCategory);
router.put('/:id', verifyToken, isManager, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);

module.exports = router;
