const { AssetRequest, User, Asset, Assignment, Notification } = require('../models');
const { Op } = require('sequelize');

const requestIncludes = [
  { model: User, as: 'Requester', attributes: ['id', 'name', 'email'] },
  { model: User, as: 'Approver', attributes: ['id', 'name'] },
  { model: Asset, as: 'ApprovedAsset', attributes: ['id', 'name', 'serialNumber', 'model'] },
];

// Employee: Create a new asset request ticket
const createRequest = async (req, res) => {
  try {
    const { requestedAssetName, assetType, reason, priority } = req.body;
    if (!requestedAssetName || !reason) {
      return res.status(400).json({ message: 'Asset name and reason are required.' });
    }
    const request = await AssetRequest.create({
      employeeId: req.user.id,
      requestedAssetName,
      assetType: assetType || 'General',
      reason,
      priority: priority || 'Medium',
      status: 'Pending',
    });

    // Notify all managers/admins
    try {
      const managers = await User.findAll({
        include: [{ association: 'Role', where: { name: { [Op.in]: ['Admin', 'Manager'] } } }],
      });
      await Promise.all(managers.map(m =>
        Notification.create({
          userId: m.id,
          type: 'info',
          title: 'New Asset Request',
          message: `${req.user.name} has requested: ${requestedAssetName}`,
          isRead: false,
        }).catch(() => {}) // don't fail if notification table differs
      ));
    } catch (_) { /* notifications are non-critical */ }

    return res.status(201).json({ message: 'Asset request submitted successfully.', request });
  } catch (error) {
    console.error('Error creating asset request:', error);
    return res.status(500).json({ message: 'Server error creating asset request.' });
  }
};

// Employee: View their own requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await AssetRequest.findAll({
      where: { employeeId: req.user.id },
      include: requestIncludes,
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching my requests:', error);
    return res.status(500).json({ message: 'Server error fetching your requests.' });
  }
};

// Manager/Admin: View all requests
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const requests = await AssetRequest.findAll({
      where,
      include: requestIncludes,
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching all requests:', error);
    return res.status(500).json({ message: 'Server error fetching asset requests.' });
  }
};

// Manager/Admin: Approve a request and assign asset to employee
const approveRequest = async (req, res) => {
  try {
    const { assetId } = req.body;
    if (!assetId) {
      return res.status(400).json({ message: 'You must select an asset to approve this request.' });
    }

    const request = await AssetRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Asset request not found.' });
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Request is already ${request.status}.` });
    }

    const asset = await Asset.findByPk(assetId);
    if (!asset) return res.status(404).json({ message: 'Selected asset not found.' });

    // Update request status
    await request.update({
      status: 'Approved',
      approvedBy: req.user.id,
      approvedAssetId: assetId,
      approvedAt: new Date(),
    });

    // Auto-create assignment
    await Assignment.create({
      assetId,
      employeeId: request.employeeId,
      assignedDate: new Date(),
      status: 'Active',
      notes: `Auto-assigned via asset request #${request.id}: ${request.requestedAssetName}`,
    });

    // Update asset status to Assigned
    await asset.update({ status: 'Assigned' });

    // Notify the requesting employee
    try {
      await Notification.create({
        userId: request.employeeId,
        type: 'success',
        title: 'Asset Request Approved!',
        message: `Your request for "${request.requestedAssetName}" was approved. ${asset.name} has been assigned to you.`,
        isRead: false,
      });
    } catch (_) {}

    return res.status(200).json({ message: 'Request approved. Asset has been assigned to the employee.' });
  } catch (error) {
    console.error('Error approving asset request:', error);
    return res.status(500).json({ message: 'Server error approving request.' });
  }
};

// Manager/Admin: Reject a request
const rejectRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const request = await AssetRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Asset request not found.' });
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Request is already ${request.status}.` });
    }

    await request.update({
      status: 'Rejected',
      approvedBy: req.user.id,
      rejectionReason: rejectionReason || 'Request rejected by manager.',
      approvedAt: new Date(),
    });

    // Notify the requesting employee
    try {
      await Notification.create({
        userId: request.employeeId,
        type: 'warning',
        title: 'Asset Request Rejected',
        message: `Your request for "${request.requestedAssetName}" was rejected. Reason: ${rejectionReason || 'Not specified.'}`,
        isRead: false,
      });
    } catch (_) {}

    return res.status(200).json({ message: 'Request rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting asset request:', error);
    return res.status(500).json({ message: 'Server error rejecting request.' });
  }
};

// Employee: Cancel their own pending request
const deleteRequest = async (req, res) => {
  try {
    const request = await AssetRequest.findByPk(req.params.id);
    if (!request) return res.status(404).json({ message: 'Asset request not found.' });

    // Only the requester can cancel, or an Admin
    if (request.employeeId !== req.user.id && req.user.Role?.name !== 'Admin') {
      return res.status(403).json({ message: 'You can only cancel your own requests.' });
    }
    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Only pending requests can be cancelled.' });
    }

    await request.update({ status: 'Cancelled' });
    return res.status(200).json({ message: 'Request cancelled successfully.' });
  } catch (error) {
    console.error('Error cancelling asset request:', error);
    return res.status(500).json({ message: 'Server error cancelling request.' });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  deleteRequest,
};
