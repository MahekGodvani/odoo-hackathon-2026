const express = require('express');
const router = express.Router();
const transferController = require('../controllers/transferController');
const { verifyToken, isManager } = require('../middleware/auth');

router.get('/', verifyToken, transferController.getTransfers);
router.post('/', verifyToken, isManager, transferController.createTransfer);
router.put('/:id', verifyToken, isManager, transferController.updateTransfer);
router.delete('/:id', verifyToken, isManager, transferController.deleteTransfer);

module.exports = router;
