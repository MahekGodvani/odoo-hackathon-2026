const { RepairRequest, Asset, User } = require('../models');

const getRepairs = async (req, res) => {
  try {
    const { status } = req.query;
    const whereClause = {};
    if (status) whereClause.status = status;

    const repairs = await RepairRequest.findAll({
      where: whereClause,
      include: [
        { model: Asset, as: 'Asset', attributes: ['id', 'name', 'serialNumber', 'model', 'status'] },
        { model: User, as: 'Requester', attributes: ['id', 'name', 'email'] },
      ],
      order: [['requestDate', 'DESC']],
    });

    return res.status(200).json(repairs);
  } catch (error) {
    console.error('Error fetching repair requests:', error);
    return res.status(500).json({ message: 'Server error retrieving repair requests' });
  }
};

const createRepair = async (req, res) => {
  try {
    const { assetId, description, priority } = req.body;

    if (!assetId || !description) {
      return res.status(400).json({ message: 'Asset ID and description are required' });
    }

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const repair = await RepairRequest.create({
      assetId,
      requestedBy: req.user.id,
      requestDate: new Date(),
      description,
      priority: priority || 'Medium',
      status: 'Pending',
      cost: 0.00,
    });

    // Mark asset as Under Maintenance
    asset.status = 'Under Maintenance';
    await asset.save();

    return res.status(201).json(repair);
  } catch (error) {
    console.error('Error creating repair request:', error);
    return res.status(500).json({ message: 'Server error saving repair request' });
  }
};

const updateRepair = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, cost, notes } = req.body;

    const repair = await RepairRequest.findByPk(id, {
      include: [{ model: Asset, as: 'Asset' }],
    });

    if (!repair) {
      return res.status(404).json({ message: 'Repair request not found' });
    }

    const updateData = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (cost !== undefined) updateData.cost = cost;
    if (notes !== undefined) updateData.notes = notes;

    if (status === 'Completed') {
      updateData.completedDate = new Date();
    }

    await repair.update(updateData);

    // Sync Asset status if status is resolved
    if (repair.Asset) {
      if (status === 'Completed' || status === 'Rejected') {
        const hasAssignment = await repair.Asset.getAssignments({ where: { status: 'Active' } });
        repair.Asset.status = hasAssignment.length > 0 ? 'Assigned' : 'Available';
        await repair.Asset.save();
      } else if (status === 'In Progress') {
        repair.Asset.status = 'Under Maintenance';
        await repair.Asset.save();
      }
    }

    return res.status(200).json(repair);
  } catch (error) {
    console.error('Error updating repair request:', error);
    return res.status(500).json({ message: 'Server error updating repair request' });
  }
};

module.exports = {
  getRepairs,
  createRepair,
  updateRepair,
};
