const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { verifyToken, isManager, isTech } = require('../middleware/auth');

/**
 * @openapi
 * /api/maintenance/schedules:
 *   get:
 *     summary: Retrieve list of scheduled maintenance tasks
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Maintenance schedules retrieved successfully
 */
router.get('/schedules', verifyToken, maintenanceController.getSchedules);

/**
 * @openapi
 * /api/maintenance/schedules:
 *   post:
 *     summary: Create a new recurring or single maintenance schedule (Manager/Admin only)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - frequency
 *               - nextDueDate
 *             properties:
 *               assetId:
 *                 type: integer
 *               frequency:
 *                 type: string
 *                 enum: [once, weekly, monthly, quarterly, yearly]
 *               nextDueDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Maintenance schedule created successfully
 */
router.post('/schedules', verifyToken, isManager, maintenanceController.createSchedule);

/**
 * @openapi
 * /api/maintenance/records:
 *   get:
 *     summary: Retrieve list of historical maintenance logs
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Maintenance log list loaded
 */
router.get('/records', verifyToken, maintenanceController.getRecords);

/**
 * @openapi
 * /api/maintenance/records:
 *   post:
 *     summary: Create a new maintenance completion record (Technician/Manager/Admin)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assetId
 *               - performedDate
 *               - status
 *             properties:
 *               assetId:
 *                 type: integer
 *               performedDate:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [completed, incomplete]
 *               cost:
 *                 type: number
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Maintenance record saved successfully
 */
router.post('/records', verifyToken, isTech, maintenanceController.createRecord);

/**
 * @openapi
 * /api/maintenance/records/{id}:
 *   put:
 *     summary: Modify properties of a maintenance execution record (Technician/Manager/Admin)
 *     tags: [Maintenance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Maintenance record updated
 */
router.put('/records/:id', verifyToken, isTech, maintenanceController.updateRecord);

module.exports = router;
