const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { verifyToken, isManager, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, departmentController.getDepartments);
router.post('/', verifyToken, isManager, departmentController.createDepartment);
router.put('/:id', verifyToken, isManager, departmentController.updateDepartment);
router.delete('/:id', verifyToken, isAdmin, departmentController.deleteDepartment);

module.exports = router;
