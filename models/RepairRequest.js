const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RepairRequest = sequelize.define('RepairRequest', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requestDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pending', // Pending, In Progress, Completed, Rejected
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Medium', // Low, Medium, High, Critical
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  completedDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'repair_requests',
});

module.exports = RepairRequest;
