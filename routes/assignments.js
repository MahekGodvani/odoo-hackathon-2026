const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken, isManager } = require('../middleware/auth');

router.get('/', verifyToken, assignmentController.getAssignments);
router.post('/', verifyToken, isManager, assignmentController.createAssignment);
router.put('/:id', verifyToken, isManager, assignmentController.returnAssignment);
router.post('/return', verifyToken, isManager, assignmentController.returnAssignment);

module.exports = router;
