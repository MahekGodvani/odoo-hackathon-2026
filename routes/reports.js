const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken } = require('../middleware/auth');

router.get('/dashboard', verifyToken, reportController.getDashboardStats);
router.get('/module-stats', verifyToken, reportController.getModuleStats);
router.get('/export/excel', verifyToken, reportController.exportExcel);
router.get('/export/pdf', verifyToken, reportController.exportPDF);

module.exports = router;
