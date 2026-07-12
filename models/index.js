const { sequelize } = require('../config/database');
const Role = require('./Role');
const User = require('./User');
const Department = require('./Department');
const Category = require('./Category');
const Vendor = require('./Vendor');
const Asset = require('./Asset');
const Assignment = require('./Assignment');
const Transfer = require('./Transfer');
const MaintenanceSchedule = require('./MaintenanceSchedule');
const MaintenanceRecord = require('./MaintenanceRecord');
const RepairRequest = require('./RepairRequest');
const Document = require('./Document');
const Notification = require('./Notification');
const ActivityLog = require('./ActivityLog');
const Setting = require('./Setting');
const AssetRequest = require('./AssetRequest');

// 1. Roles and Users
Role.hasMany(User, { foreignKey: 'roleId', onDelete: 'RESTRICT' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'Role' });

// 2. Users and Departments (Manager relationship)
User.hasMany(Department, { foreignKey: 'managerId', as: 'ManagedDepartments', onDelete: 'SET NULL' });
Department.belongsTo(User, { foreignKey: 'managerId', as: 'Manager' });

// 3. Categories and Assets
Category.hasMany(Asset, { foreignKey: 'categoryId', onDelete: 'RESTRICT' });
Asset.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

// 4. Departments and Assets
Department.hasMany(Asset, { foreignKey: 'departmentId', onDelete: 'RESTRICT' });
Asset.belongsTo(Department, { foreignKey: 'departmentId', as: 'Department' });

// 5. Vendors and Assets
Vendor.hasMany(Asset, { foreignKey: 'vendorId', onDelete: 'SET NULL' });
Asset.belongsTo(Vendor, { foreignKey: 'vendorId', as: 'Vendor' });

// 6. Assets and Assignments
Asset.hasMany(Assignment, { foreignKey: 'assetId', onDelete: 'CASCADE' });
Assignment.belongsTo(Asset, { foreignKey: 'assetId', as: 'Asset' });

// 7. Users and Assignments (Assigned employees)
User.hasMany(Assignment, { foreignKey: 'employeeId', onDelete: 'CASCADE' });
Assignment.belongsTo(User, { foreignKey: 'employeeId', as: 'Employee' });

// 8. Assets and Transfers
Asset.hasMany(Transfer, { foreignKey: 'assetId', onDelete: 'CASCADE' });
Transfer.belongsTo(Asset, { foreignKey: 'assetId', as: 'Asset' });

Department.hasMany(Transfer, { foreignKey: 'fromDepartmentId', as: 'FromTransfers', onDelete: 'SET NULL' });
Transfer.belongsTo(Department, { foreignKey: 'fromDepartmentId', as: 'FromDepartment' });

Department.hasMany(Transfer, { foreignKey: 'toDepartmentId', as: 'ToTransfers', onDelete: 'CASCADE' });
Transfer.belongsTo(Department, { foreignKey: 'toDepartmentId', as: 'ToDepartment' });

User.hasMany(Transfer, { foreignKey: 'approvedBy', as: 'ApprovedTransfers', onDelete: 'SET NULL' });
Transfer.belongsTo(User, { foreignKey: 'approvedBy', as: 'Approver' });

// 9. Assets and MaintenanceSchedules
Asset.hasMany(MaintenanceSchedule, { foreignKey: 'assetId', onDelete: 'CASCADE' });
MaintenanceSchedule.belongsTo(Asset, { foreignKey: 'assetId', as: 'Asset' });

User.hasMany(MaintenanceSchedule, { foreignKey: 'assignedTechnicianId', as: 'Schedules', onDelete: 'SET NULL' });
MaintenanceSchedule.belongsTo(User, { foreignKey: 'assignedTechnicianId', as: 'Technician' });

// 10. Assets, Schedules and Records
Asset.hasMany(MaintenanceRecord, { foreignKey: 'assetId', onDelete: 'CASCADE' });
MaintenanceRecord.belongsTo(Asset, { foreignKey: 'assetId', as: 'Asset' });

MaintenanceSchedule.hasMany(MaintenanceRecord, { foreignKey: 'maintenanceScheduleId', onDelete: 'SET NULL' });
MaintenanceRecord.belongsTo(MaintenanceSchedule, { foreignKey: 'maintenanceScheduleId', as: 'Schedule' });

User.hasMany(MaintenanceRecord, { foreignKey: 'performedBy', as: 'PerformedMaintenance', onDelete: 'CASCADE' });
MaintenanceRecord.belongsTo(User, { foreignKey: 'performedBy', as: 'Technician' });

// 11. Assets and RepairRequests
Asset.hasMany(RepairRequest, { foreignKey: 'assetId', onDelete: 'CASCADE' });
RepairRequest.belongsTo(Asset, { foreignKey: 'assetId', as: 'Asset' });

User.hasMany(RepairRequest, { foreignKey: 'requestedBy', as: 'RepairRequests', onDelete: 'CASCADE' });
RepairRequest.belongsTo(User, { foreignKey: 'requestedBy', as: 'Requester' });

// 12. Assets and Documents
Asset.hasMany(Document, { foreignKey: 'assetId', onDelete: 'CASCADE' });
Document.belongsTo(Asset, { foreignKey: 'assetId', as: 'Asset' });

// 13. Users and Notifications
User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// 14. Users and ActivityLogs
User.hasMany(ActivityLog, { foreignKey: 'userId', onDelete: 'SET NULL' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'User' });

// 15. Asset Requests — Employee raises ticket
User.hasMany(AssetRequest, { foreignKey: 'employeeId', as: 'AssetRequests', onDelete: 'CASCADE' });
AssetRequest.belongsTo(User, { foreignKey: 'employeeId', as: 'Requester' });

User.hasMany(AssetRequest, { foreignKey: 'approvedBy', as: 'ApprovedRequests', onDelete: 'SET NULL' });
AssetRequest.belongsTo(User, { foreignKey: 'approvedBy', as: 'Approver' });

Asset.hasMany(AssetRequest, { foreignKey: 'approvedAssetId', as: 'AssignedRequests', onDelete: 'SET NULL' });
AssetRequest.belongsTo(Asset, { foreignKey: 'approvedAssetId', as: 'ApprovedAsset' });

module.exports = {
  sequelize,
  Role,
  User,
  Department,
  Category,
  Vendor,
  Asset,
  Assignment,
  Transfer,
  MaintenanceSchedule,
  MaintenanceRecord,
  RepairRequest,
  Document,
  Notification,
  ActivityLog,
  Setting,
  AssetRequest,
};
