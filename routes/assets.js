const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { verifyToken, isManager, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, assetController.getAssets);
router.get('/:id', verifyToken, assetController.getAssetById);
router.post('/', verifyToken, isManager, assetController.createAsset);
router.put('/:id', verifyToken, isManager, assetController.updateAsset);
router.delete('/:id', verifyToken, isAdmin, assetController.deleteAsset);

module.exports = router;
