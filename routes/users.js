const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isManager, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isManager, userController.getUsers);
router.post('/', verifyToken, isAdmin, userController.createUser);
router.put('/:id', verifyToken, isAdmin, userController.updateUser);

module.exports = router;
