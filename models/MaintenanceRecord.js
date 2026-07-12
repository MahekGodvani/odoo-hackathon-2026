const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const MaintenanceRecord = sequelize.define('MaintenanceRecord', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maintenanceScheduleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  performedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  performedDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Completed', // Completed, In Progress, Deferred
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'maintenance_records',
});

module.exports = MaintenanceRecord;
