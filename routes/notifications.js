const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, notificationController.getNotifications);
router.get('/read-all', verifyToken, notificationController.markAllAsRead); // Keep GET because Notifications.tsx calls api.get('/notifications/read-all')
router.put('/read-all', verifyToken, notificationController.markAllAsRead);
router.get('/:id/read', verifyToken, notificationController.markAsRead); // Keep GET because Notifications.tsx calls api.get('/notifications/:id/read')
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;
