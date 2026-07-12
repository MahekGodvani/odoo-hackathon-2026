const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { verifyToken, isManager, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, vendorController.getVendors);
router.post('/', verifyToken, isManager, vendorController.createVendor);
router.put('/:id', verifyToken, isManager, vendorController.updateVendor);
router.delete('/:id', verifyToken, isAdmin, vendorController.deleteVendor);

module.exports = router;
