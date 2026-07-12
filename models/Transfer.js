const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transfer = sequelize.define('Transfer', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  fromDepartmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  toDepartmentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transferDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Approved', // Pending, Approved, Rejected
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'transfers',
});

module.exports = Transfer;
