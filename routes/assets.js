const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { verifyToken, isManager, isAdmin } = require('../middleware/auth');

/**
 * @openapi
 * /api/assets:
 *   get:
 *     summary: Retrieve list of assets with optional search/filters
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *       - name: categoryId
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Assets list retrieved successfully
 */
router.get('/', verifyToken, assetController.getAssets);

/**
 * @openapi
 * /api/assets/{id}:
 *   get:
 *     summary: Retrieve detailed info of a single asset by primary key
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset details retrieved
 *       404:
 *         description: Asset not found
 */
router.get('/:id', verifyToken, assetController.getAssetById);

/**
 * @openapi
 * /api/assets:
 *   post:
 *     summary: Register a new enterprise asset (Manager/Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - tag
 *               - categoryId
 *               - status
 *             properties:
 *               name:
 *                 type: string
 *               tag:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Asset registered and QR Code generated
 */
router.post('/', verifyToken, isManager, assetController.createAsset);

/**
 * @openapi
 * /api/assets/{id}:
 *   put:
 *     summary: Modify properties of an existing asset (Manager/Admin only)
 *     tags: [Assets]
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
 *         description: Asset properties updated
 */
router.put('/:id', verifyToken, isManager, assetController.updateAsset);

/**
 * @openapi
 * /api/assets/{id}:
 *   delete:
 *     summary: Remove an asset permanently (Admin only)
 *     tags: [Assets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asset deleted successfully
 */
router.delete('/:id', verifyToken, isAdmin, assetController.deleteAsset);

module.exports = router;
