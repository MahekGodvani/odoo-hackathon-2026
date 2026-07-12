const { Transfer, Asset, Department, User } = require('../models');

const getTransfers = async (req, res) => {
  try {
    const { assetId } = req.query;
    const whereClause = {};
    if (assetId) whereClause.assetId = assetId;

    const transfers = await Transfer.findAll({
      where: whereClause,
      include: [
        { model: Asset, as: 'Asset', attributes: ['id', 'name', 'serialNumber', 'model'] },
        { model: Department, as: 'FromDepartment', attributes: ['id', 'name', 'code'] },
        { model: Department, as: 'ToDepartment', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'Approver', attributes: ['id', 'name'] },
      ],
      order: [['transferDate', 'DESC']],
    });

    return res.status(200).json(transfers);
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return res.status(500).json({ message: 'Server error retrieving transfer log' });
  }
};

const createTransfer = async (req, res) => {
  try {
    const { assetId, toDepartmentId, notes } = req.body;

    if (!assetId || !toDepartmentId) {
      return res.status(400).json({ message: 'Asset ID and destination Department ID are required' });
    }

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const toDept = await Department.findByPk(toDepartmentId);
    if (!toDept) {
      return res.status(404).json({ message: 'Destination department not found' });
    }

    if (asset.departmentId === toDepartmentId) {
      return res.status(400).json({ message: 'Asset is already allocated to this department' });
    }

    const fromDeptId = asset.departmentId;

    // Create the transfer log
    const transfer = await Transfer.create({
      assetId,
      fromDepartmentId: fromDeptId,
      toDepartmentId,
      transferDate: new Date(),
      approvedBy: req.user.id,
      status: 'Approved',
      notes,
    });

    // Update the asset department ID
    asset.departmentId = toDepartmentId;
    await asset.save();

    return res.status(201).json(transfer);
  } catch (error) {
    console.error('Error creating transfer:', error);
    return res.status(500).json({ message: 'Server error logging asset transfer' });
  }
};

const deleteTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer record not found' });
    }
    await transfer.destroy();
    return res.status(200).json({ message: 'Transfer record deleted successfully' });
  } catch (error) {
    console.error('Error deleting transfer:', error);
    return res.status(500).json({ message: 'Server error deleting transfer' });
  }
};

const updateTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findByPk(req.params.id);
    if (!transfer) {
      return res.status(404).json({ message: 'Transfer record not found' });
    }
    const { status, notes } = req.body;
    if (status) transfer.status = status;
    if (notes !== undefined) transfer.notes = notes;
    await transfer.save();
    return res.status(200).json({ message: 'Transfer updated successfully', transfer });
  } catch (error) {
    console.error('Error updating transfer:', error);
    return res.status(500).json({ message: 'Server error updating transfer' });
  }
};

module.exports = {
  getTransfers,
  createTransfer,
  updateTransfer,
  deleteTransfer,
};
