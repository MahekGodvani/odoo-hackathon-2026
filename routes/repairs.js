const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const { verifyToken, isTech } = require('../middleware/auth');

router.get('/', verifyToken, repairController.getRepairs);
router.post('/', verifyToken, repairController.createRepair);
router.put('/:id', verifyToken, isTech, repairController.updateRepair);

module.exports = router;
