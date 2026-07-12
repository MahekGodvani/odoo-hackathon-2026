const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken, isManager } = require('../middleware/auth');

/**
 * @openapi
 * /api/assignments:
 *   get:
 *     summary: Retrieve list of assignments
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assignments list retrieved successfully
 */
router.get('/', verifyToken, assignmentController.getAssignments);

/**
 * @openapi
 * /api/assignments:
 *   post:
 *     summary: Assign an asset to a department/employee (Manager/Admin only)
 *     tags: [Assignments]
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
 *               - assignedToType
 *               - checkoutDate
 *             properties:
 *               assetId:
 *                 type: integer
 *               assignedToType:
 *                 type: string
 *                 enum: [employee, department]
 *               departmentId:
 *                 type: integer
 *               employeeId:
 *                 type: integer
 *               checkoutDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset successfully checked out
 */
router.post('/', verifyToken, isManager, assignmentController.createAssignment);

/**
 * @openapi
 * /api/assignments/{id}:
 *   put:
 *     summary: Return an assigned asset by assignment ID (Manager/Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               returnDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset successfully returned
 */
router.put('/:id', verifyToken, isManager, assignmentController.returnAssignment);

/**
 * @openapi
 * /api/assignments/return:
 *   post:
 *     summary: Alternate endpoint to return an assigned asset (Manager/Admin only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignmentId
 *             properties:
 *               assignmentId:
 *                 type: integer
 *               returnDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Asset successfully returned
 */
router.post('/return', verifyToken, isManager, assignmentController.returnAssignment);
router.delete('/:id', verifyToken, isManager, assignmentController.deleteAssignment);

module.exports = router;
