const { Assignment, Asset, User, Notification } = require('../models');

const getAssignments = async (req, res) => {
  try {
    const { status, employeeId, assetId } = req.query;
    const whereClause = {};

    if (status) whereClause.status = status;
    if (employeeId) whereClause.employeeId = employeeId;
    if (assetId) whereClause.assetId = assetId;

    const assignments = await Assignment.findAll({
      where: whereClause,
      include: [
        { model: Asset, as: 'Asset', attributes: ['id', 'name', 'serialNumber', 'model'] },
        { model: User, as: 'Employee', attributes: ['id', 'name', 'email'] },
      ],
      order: [['assignedDate', 'DESC']],
    });

    return res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return res.status(500).json({ message: 'Server error retrieving assignments' });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { assetId, employeeId, notes } = req.body;

    if (!assetId || !employeeId) {
      return res.status(400).json({ message: 'Asset ID and Employee ID are required' });
    }

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    if (asset.status !== 'Available') {
      return res.status(400).json({ message: `Asset is currently not available (status: ${asset.status})` });
    }

    const employee = await User.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee user not found' });
    }

    // Create assignment transactionally/sequentially
    const assignment = await Assignment.create({
      assetId,
      employeeId,
      notes,
      assignedDate: new Date(),
      status: 'Active',
    });

    // Update asset status
    asset.status = 'Assigned';
    await asset.save();

    return res.status(201).json(assignment);
  } catch (error) {
    console.error('Error creating assignment:', error);
    return res.status(500).json({ message: 'Server error during asset assignment' });
  }
};

const returnAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.body; // fallback from POST /api/assignments/return

    const id = req.params.id || assignmentId;

    if (!id) {
      return res.status(400).json({ message: 'Assignment ID is required' });
    }

    const assignment = await Assignment.findByPk(id, {
      include: [{ model: Asset, as: 'Asset' }],
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment record not found' });
    }

    if (assignment.status === 'Returned') {
      return res.status(400).json({ message: 'Asset has already been returned' });
    }

    // Update assignment
    assignment.status = 'Returned';
    assignment.returnDate = new Date();
    await assignment.save();

    // Update asset status to Available
    if (assignment.Asset) {
      assignment.Asset.status = 'Available';
      await assignment.Asset.save();
    }

    // Create notifications for asset return
    try {
      const assetName = assignment.Asset ? assignment.Asset.name : `Asset #${assignment.assetId}`;
      const employee = await User.findByPk(assignment.employeeId);
      const employeeName = employee ? employee.name : `Employee #${assignment.employeeId}`;

      const adminsAndManagers = await User.findAll({
        where: {
          roleId: [1, 2] // 1: Admin, 2: Manager
        }
      });

      const notificationsToCreate = [
        {
          userId: assignment.employeeId,
          title: 'Asset Return Processed',
          message: `Your return of asset "${assetName}" has been successfully checked in.`,
          type: 'success',
          status: 'Unread'
        }
      ];

      adminsAndManagers.forEach(user => {
        if (user.id !== assignment.employeeId) {
          notificationsToCreate.push({
            userId: user.id,
            title: 'Asset Checked In',
            message: `Asset "${assetName}" returned by employee "${employeeName}".`,
            type: 'info',
            status: 'Unread'
          });
        }
      });

      await Notification.bulkCreate(notificationsToCreate);
    } catch (notifErr) {
      console.error('Failed to create return assignment notifications:', notifErr);
    }

    return res.status(200).json({
      message: 'Asset successfully returned and checked in',
      assignment,
    });
  } catch (error) {
    console.error('Error returning assignment:', error);
    return res.status(500).json({ message: 'Server error during asset check-in' });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    const asset = await Asset.findByPk(assignment.assetId);
    if (asset) {
      asset.status = 'Available';
      await asset.save();
    }
    await assignment.destroy();
    return res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return res.status(500).json({ message: 'Server error deleting assignment' });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  returnAssignment,
  deleteAssignment,
};
