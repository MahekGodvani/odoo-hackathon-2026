const express = require('express');
const router = express.Router();
const repairController = require('../controllers/repairController');
const { verifyToken, isTech } = require('../middleware/auth');

/**
 * @openapi
 * /api/repairs:
 *   get:
 *     summary: Retrieve list of asset repair requests
 *     tags: [Repairs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Repair requests list retrieved successfully
 */
router.get('/', verifyToken, repairController.getRepairs);

/**
 * @openapi
 * /api/repairs:
 *   post:
 *     summary: Create/log a new asset repair ticket
 *     tags: [Repairs]
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
 *               - description
 *               - priority
 *             properties:
 *               assetId:
 *                 type: integer
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, critical]
 *     responses:
 *       201:
 *         description: Repair request created successfully
 */
router.post('/', verifyToken, repairController.createRepair);

/**
 * @openapi
 * /api/repairs/{id}:
 *   put:
 *     summary: Update/resolve an asset repair ticket status (Technician/Manager/Admin)
 *     tags: [Repairs]
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
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *               repairCost:
 *                 type: number
 *               completionDate:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Repair ticket successfully updated
 */
router.put('/:id', verifyToken, isTech, repairController.updateRepair);
router.delete('/:id', verifyToken, isTech, repairController.deleteRepair);

module.exports = router;
