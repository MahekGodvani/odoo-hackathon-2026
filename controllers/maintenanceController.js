const { MaintenanceSchedule, MaintenanceRecord, Asset, User } = require('../models');

const getSchedules = async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.findAll({
      include: [
        { model: Asset, as: 'Asset', attributes: ['id', 'name', 'serialNumber', 'model'] },
        { model: User, as: 'Technician', attributes: ['id', 'name', 'email'] },
      ],
      order: [['nextDueDate', 'ASC']],
    });
    return res.status(200).json(schedules);
  } catch (error) {
    console.error('Error fetching maintenance schedules:', error);
    return res.status(500).json({ message: 'Server error retrieving schedules' });
  }
};

const createSchedule = async (req, res) => {
  try {
    const { assetId, title, description, frequency, nextDueDate, assignedTechnicianId } = req.body;

    if (!assetId || !title || !frequency || !nextDueDate) {
      return res.status(400).json({ message: 'Asset, title, frequency, and next due date are required' });
    }

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const schedule = await MaintenanceSchedule.create({
      assetId,
      title,
      description,
      frequency,
      nextDueDate,
      assignedTechnicianId: assignedTechnicianId || null,
    });

    return res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule:', error);
    return res.status(500).json({ message: 'Server error creating maintenance schedule' });
  }
};

const getRecords = async (req, res) => {
  try {
    const records = await MaintenanceRecord.findAll({
      include: [
        { model: Asset, as: 'Asset', attributes: ['id', 'name', 'serialNumber', 'model'] },
        { model: User, as: 'Technician', attributes: ['id', 'name'] },
      ],
      order: [['performedDate', 'DESC']],
    });
    return res.status(200).json(records);
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return res.status(500).json({ message: 'Server error retrieving maintenance records' });
  }
};

const createRecord = async (req, res) => {
  try {
    const { assetId, maintenanceScheduleId, description, cost, status, notes } = req.body;

    if (!assetId || !description) {
      return res.status(400).json({ message: 'Asset ID and description are required' });
    }

    const asset = await Asset.findByPk(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    const record = await MaintenanceRecord.create({
      assetId,
      maintenanceScheduleId: maintenanceScheduleId || null,
      performedBy: req.user.id,
      performedDate: new Date(),
      description,
      cost: cost || 0.00,
      status: status || 'Completed',
      notes,
    });

    // Update asset status based on maintenance state
    if (status === 'In Progress') {
      asset.status = 'Under Maintenance';
      await asset.save();
    } else if (status === 'Completed') {
      // Check if the asset has active assignment to decide status
      const hasAssignment = await asset.getAssignments({ where: { status: 'Active' } });
      asset.status = hasAssignment.length > 0 ? 'Assigned' : 'Available';
      await asset.save();

      // If tied to a schedule, we update the schedule's next due date if recurring
      if (maintenanceScheduleId) {
        const schedule = await MaintenanceSchedule.findByPk(maintenanceScheduleId);
        if (schedule) {
          let nextDate = new Date(schedule.nextDueDate);
          if (schedule.frequency === 'Monthly') nextDate.setMonth(nextDate.getMonth() + 1);
          else if (schedule.frequency === 'Quarterly') nextDate.setMonth(nextDate.getMonth() + 3);
          else if (schedule.frequency === 'Bi-annually') nextDate.setMonth(nextDate.getMonth() + 6);
          else if (schedule.frequency === 'Annually') nextDate.setFullYear(nextDate.getFullYear() + 1);
          
          schedule.nextDueDate = nextDate.toISOString().split('T')[0];
          await schedule.save();
        }
      }
    }

    return res.status(201).json(record);
  } catch (error) {
    console.error('Error creating maintenance record:', error);
    return res.status(500).json({ message: 'Server error saving maintenance record' });
  }
};

const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, cost, description } = req.body;

    const record = await MaintenanceRecord.findByPk(id, {
      include: [{ model: Asset, as: 'Asset' }],
    });

    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    await record.update({
      status: status !== undefined ? status : record.status,
      notes: notes !== undefined ? notes : record.notes,
      cost: cost !== undefined ? cost : record.cost,
      description: description !== undefined ? description : record.description,
    });

    // Sync Asset status
    if (record.Asset) {
      if (record.status === 'In Progress') {
        record.Asset.status = 'Under Maintenance';
        await record.Asset.save();
      } else if (record.status === 'Completed') {
        const hasAssignment = await record.Asset.getAssignments({ where: { status: 'Active' } });
        record.Asset.status = hasAssignment.length > 0 ? 'Assigned' : 'Available';
        await record.Asset.save();
      }
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error('Error updating maintenance record:', error);
    return res.status(500).json({ message: 'Server error updating maintenance record' });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: 'Maintenance schedule not found' });
    }
    await schedule.destroy();
    return res.status(200).json({ message: 'Maintenance schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return res.status(500).json({ message: 'Server error deleting maintenance schedule' });
  }
};

const updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { assetId, title, description, frequency, nextDueDate, assignedTechnicianId } = req.body;
    const schedule = await MaintenanceSchedule.findByPk(id);
    if (!schedule) {
      return res.status(404).json({ message: 'Maintenance schedule not found' });
    }
    await schedule.update({
      assetId: assetId !== undefined ? assetId : schedule.assetId,
      title: title !== undefined ? title : schedule.title,
      description: description !== undefined ? description : schedule.description,
      frequency: frequency !== undefined ? frequency : schedule.frequency,
      nextDueDate: nextDueDate !== undefined ? nextDueDate : schedule.nextDueDate,
      assignedTechnicianId: assignedTechnicianId !== undefined ? assignedTechnicianId : schedule.assignedTechnicianId,
    });
    return res.status(200).json(schedule);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return res.status(500).json({ message: 'Server error updating maintenance schedule' });
  }
};

module.exports = {
  getSchedules,
  createSchedule,
  getRecords,
  createRecord,
  updateRecord,
  deleteSchedule,
  updateSchedule,
};
