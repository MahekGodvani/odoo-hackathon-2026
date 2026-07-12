const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { verifyToken, isManager, isTech } = require('../middleware/auth');

router.get('/schedules', verifyToken, maintenanceController.getSchedules);
router.post('/schedules', verifyToken, isManager, maintenanceController.createSchedule);
router.get('/records', verifyToken, maintenanceController.getRecords);
router.post('/records', verifyToken, isTech, maintenanceController.createRecord);
router.put('/records/:id', verifyToken, isTech, maintenanceController.updateRecord);

module.exports = router;
