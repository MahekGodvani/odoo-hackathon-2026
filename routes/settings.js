const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, settingController.getSettings);
router.put('/', verifyToken, isAdmin, settingController.updateSettings);

module.exports = router;
