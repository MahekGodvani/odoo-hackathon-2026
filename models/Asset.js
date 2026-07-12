const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Asset = sequelize.define('Asset', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  serialNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Available', // Available, Assigned, Under Maintenance, Retired
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Excellent', // Excellent, Good, Fair, Poor
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  purchaseCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  vendorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  warrantyExpiry: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  qrCodeUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'assets',
});

module.exports = Asset;
