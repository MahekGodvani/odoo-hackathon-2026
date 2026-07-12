const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/assetRequestController');
const { verifyToken, isManager } = require('../middleware/auth');

// Any logged-in user can raise and view their own requests
router.get('/mine', verifyToken, ctrl.getMyRequests);
router.post('/', verifyToken, ctrl.createRequest);
router.delete('/:id', verifyToken, ctrl.deleteRequest);

// Manager/Admin only — see all, approve, reject
router.get('/', verifyToken, isManager, ctrl.getAllRequests);
router.put('/:id/approve', verifyToken, isManager, ctrl.approveRequest);
router.put('/:id/reject', verifyToken, isManager, ctrl.rejectRequest);

module.exports = router;
