const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaintenanceSchedule = sequelize.define('MaintenanceSchedule', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false, // One-time, Monthly, Quarterly, Bi-annually, Annually
  },
  nextDueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  assignedTechnicianId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'maintenance_schedules',
});

module.exports = MaintenanceSchedule;
