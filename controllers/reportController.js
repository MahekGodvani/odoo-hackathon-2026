const { Asset, Category, Department, User, Vendor, Transfer, RepairRequest, MaintenanceRecord, Assignment, ActivityLog, Notification } = require('../models');
const { Op, fn, col } = require('sequelize');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

// Helper to format relative time
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return interval + " year" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return interval + " month" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " day" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hour" + (interval > 1 ? "s" : "") + " ago";
  interval = Math.floor(seconds / 60);
  if (interval >= 1) return interval + " min" + (interval > 1 ? "s" : "") + " ago";
  return 'just now';
};

const getDashboardStats = async (req, res) => {
  try {
    // 1. KPI Counts
    const totalAssets = await Asset.count();
    const assignedAssets = await Asset.count({ where: { status: 'Assigned' } });
    const underMaintenance = await Asset.count({ where: { status: 'Under Maintenance' } });
    
    // Warranty expiring in 30 days
    const today = new Date();
    const next30Days = new Date();
    next30Days.setDate(today.getDate() + 30);
    const warrantyExpiring = await Asset.count({
      where: {
        warrantyExpiry: {
          [Op.between]: [today.toISOString().split('T')[0], next30Days.toISOString().split('T')[0]],
        },
      },
    });

    const activeRepairs = await RepairRequest.count({
      where: { status: { [Op.in]: ['Pending', 'In Progress'] } },
    });

    const totalDepartments = await Department.count();
    const totalEmployees = await User.count();

    // 2. Charts Data
    // A. Asset distribution by Category
    const categoryDistribution = await Asset.findAll({
      attributes: [
        [col('Category.name'), 'categoryName'],
        [fn('COUNT', col('Asset.id')), 'count']
      ],
      include: [{ model: Category, as: 'Category', attributes: [] }],
      group: ['Category.id', 'Category.name'],
      raw: true,
    });

    // B. Asset distribution by Department
    const departmentDistribution = await Asset.findAll({
      attributes: [
        [col('Department.name'), 'departmentName'],
        [fn('COUNT', col('Asset.id')), 'count']
      ],
      include: [{ model: Department, as: 'Department', attributes: [] }],
      group: ['Department.id', 'Department.name'],
      raw: true,
    });

    // C. Monthly Purchases (current year)
    const currentYear = new Date().getFullYear();
    const monthlyPurchases = await Asset.findAll({
      attributes: [
        [fn('MONTH', col('purchaseDate')), 'month'],
        [fn('SUM', col('purchaseCost')), 'totalCost']
      ],
      where: {
        purchaseDate: {
          [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
        },
      },
      group: [fn('MONTH', col('purchaseDate'))],
      order: [[fn('MONTH', col('purchaseDate')), 'ASC']],
      raw: true,
    });

    // D. Maintenance vs Repair Costs
    const totalMaintCost = await MaintenanceRecord.sum('cost') || 0;
    const totalRepairCost = await RepairRequest.sum('cost') || 0;

    // E. Overdue Returns
    const overdueList = await Assignment.findAll({
      where: { status: 'Active' },
      include: [
        { model: Asset, as: 'Asset', attributes: ['name'] },
        { model: User, as: 'Employee', attributes: ['name'] }
      ],
      limit: 5,
      order: [['assignedDate', 'ASC']]
    });

    const overdue = overdueList.map(a => {
      const diffDays = Math.ceil((new Date() - new Date(a.assignedDate)) / (1000 * 60 * 60 * 24));
      return {
        id: a.id,
        asset: a.Asset ? a.Asset.name : `Asset #${a.assetId}`,
        assignee: a.Employee ? a.Employee.name : `Employee #${a.employeeId}`,
        dept: 'General IT',
        dueDate: `${diffDays} days active`
      };
    });

    // F. Maintenance Requests
    const activeRepairsList = await RepairRequest.findAll({
      limit: 5,
      order: [['requestDate', 'DESC']],
      include: [
        { model: Asset, as: 'Asset', attributes: ['name'] },
        { model: User, as: 'Requester', attributes: ['name'] }
      ]
    });

    const repairs = activeRepairsList.map(r => ({
      asset: r.Asset ? r.Asset.name : `Asset #${r.assetId}`,
      assignee: r.Requester ? r.Requester.name : 'Unknown User',
      priority: r.priority || 'Medium',
      status: r.status || 'Pending'
    }));

    // G. Today's Bookings
    const bookings = [
      { resource: 'Conference Room A', time: '10:00 AM - 11:30 AM', status: 'Approved' },
      { resource: 'Development Sandbox Lab', time: '1:00 PM - 3:00 PM', status: 'Pending' },
      { resource: 'Hardware Testing Station 4', time: '4:00 PM - 5:30 PM', status: 'Approved' }
    ];

    // H. Recent Activity
    const activityList = await ActivityLog.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, as: 'User', attributes: ['name'] }]
    });

    const recentActivity = activityList.map(act => {
      const name = act.User ? act.User.name : 'System User';
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      return {
        avatar: initials || 'US',
        color: '#4F46E5',
        user: name,
        action: act.action.replace('_', ' ') + (act.details ? `: ${act.details}` : ''),
        time: timeAgo(act.createdAt)
      };
    });

    // I. Notifications
    const notifs = await Notification.findAll({
      where: { userId: req.user.id },
      limit: 4,
      order: [['createdAt', 'DESC']]
    });

    const notifications = notifs.map(n => ({
      id: n.id,
      type: n.type || 'info',
      title: n.title,
      desc: n.message,
      time: timeAgo(n.createdAt),
      read: n.status === 'Read'
    }));

    return res.status(200).json({
      summary: {
        totalAssets,
        assignedAssets,
        underMaintenance,
        warrantyExpiring,
        activeRepairs,
        totalDepartments,
        totalEmployees,
      },
      charts: {
        categoryDistribution,
        departmentDistribution,
        monthlyPurchases,
        costs: {
          maintenance: parseFloat(totalMaintCost),
          repairs: parseFloat(totalRepairCost),
        },
      },
      overdue,
      repairs,
      bookings,
      recentActivity,
      notifications
    });
  } catch (error) {
    console.error('Error compiling dashboard stats:', error);
    return res.status(500).json({ message: 'Server error compiling dashboard metrics' });
  }
};

const exportExcel = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [
        { model: Category, as: 'Category', attributes: ['name'] },
        { model: Department, as: 'Department', attributes: ['name'] },
        { model: Vendor, as: 'Vendor', attributes: ['name'] },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asset Flow System');

    // Define columns
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Asset Name', key: 'name', width: 25 },
      { header: 'Serial Number', key: 'serialNumber', width: 20 },
      { header: 'Model', key: 'model', width: 20 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Department', key: 'department', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Condition', key: 'condition', width: 15 },
      { header: 'Purchase Date', key: 'purchaseDate', width: 15 },
      { header: 'Purchase Cost', key: 'purchaseCost', width: 15 },
      { header: 'Vendor', key: 'vendor', width: 25 },
      { header: 'Warranty Expiry', key: 'warrantyExpiry', width: 15 },
    ];

    // Style Header Row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1E293B' }, // Dark Slate
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Add Rows
    assets.forEach((asset) => {
      worksheet.addRow({
        id: asset.id,
        name: asset.name,
        serialNumber: asset.serialNumber || 'N/A',
        model: asset.model || 'N/A',
        category: asset.Category ? asset.Category.name : 'Uncategorized',
        department: asset.Department ? asset.Department.name : 'Unassigned',
        status: asset.status,
        condition: asset.condition,
        purchaseDate: asset.purchaseDate || 'N/A',
        purchaseCost: asset.purchaseCost ? parseFloat(asset.purchaseCost) : 0,
        vendor: asset.Vendor ? asset.Vendor.name : 'N/A',
        warrantyExpiry: asset.warrantyExpiry || 'N/A',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=assetflow_report.xlsx');

    await workbook.xlsx.write(res);
    return res.end();
  } catch (error) {
    console.error('Error generating Excel:', error);
    return res.status(500).json({ message: 'Server error generating Excel report' });
  }
};

const exportPDF = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      include: [
        { model: Category, as: 'Category', attributes: ['name'] },
        { model: Department, as: 'Department', attributes: ['name'] },
      ],
    });

    const doc = new PDFDocument({ margin: 30, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=assetflow_report.pdf');

    doc.pipe(res);

    // Header
    doc.fillColor('#1e293b').rect(0, 0, 600, 80).fill();
    doc.fillColor('#ffffff').fontSize(24).font('Helvetica-Bold').text('AssetFlow Inventory Report', 30, 28);

    doc.fillColor('#334155').fontSize(10).font('Helvetica').text(`Generated on: ${new Date().toLocaleString()}`, 400, 35);

    // Table Content
    let y = 110;
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold');
    doc.text('ID', 30, y);
    doc.text('Asset Name', 60, y);
    doc.text('Serial Number', 190, y);
    doc.text('Category', 320, y);
    doc.text('Department', 420, y);
    doc.text('Status', 520, y);

    // Draw Line
    doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(30, y + 15).lineTo(565, y + 15).stroke();

    y += 25;
    doc.font('Helvetica').fontSize(10).fillColor('#334155');

    assets.forEach((asset) => {
      // Check page break
      if (y > 750) {
        doc.addPage();
        y = 40;
        doc.fillColor('#1e293b').fontSize(12).font('Helvetica-Bold');
        doc.text('ID', 30, y);
        doc.text('Asset Name', 60, y);
        doc.text('Serial Number', 190, y);
        doc.text('Category', 320, y);
        doc.text('Department', 420, y);
        doc.text('Status', 520, y);
        doc.strokeColor('#cbd5e1').lineWidth(1).moveTo(30, y + 15).lineTo(565, y + 15).stroke();
        y += 25;
        doc.font('Helvetica').fontSize(10).fillColor('#334155');
      }

      doc.text(asset.id.toString(), 30, y);
      doc.text(asset.name.substring(0, 22), 60, y);
      doc.text(asset.serialNumber || 'N/A', 190, y);
      doc.text(asset.Category ? asset.Category.name.substring(0, 18) : 'N/A', 320, y);
      doc.text(asset.Department ? asset.Department.name.substring(0, 18) : 'N/A', 420, y);
      doc.text(asset.status, 520, y);

      y += 20;
    });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    return res.status(500).json({ message: 'Server error generating PDF report' });
  }
};

const getModuleStats = async (req, res) => {
  const { module } = req.query;
  try {
    let stats = [];

    if (module === 'categories') {
      const total = await Category.count();
      const totalAssets = await Asset.count();
      stats = [
        { key: 'categories', label: 'Categories', value: String(total) },
        { key: 'activeAssets', label: 'Active Assets', value: String(totalAssets) },
      ];

    } else if (module === 'departments') {
      const depts = await Department.count();
      const employees = await User.count();
      const assets = await Asset.count();
      const transfers = await Transfer.count();
      stats = [
        { key: 'departments', label: 'Departments', value: String(depts) },
        { key: 'employees', label: 'Employees', value: String(employees) },
        { key: 'assets', label: 'Assets', value: String(assets) },
        { key: 'transfers', label: 'Transfers', value: String(transfers) },
      ];

    } else if (module === 'employees') {
      const employees = await User.count();
      const assigned = await Assignment.count({ where: { status: { [Op.in]: ['Active', 'Assigned', 'Accepted'] } } });
      const depts = await Department.count();
      const pending = await Assignment.count({ where: { status: 'Pending' } });
      stats = [
        { key: 'employees', label: 'Employees', value: String(employees) },
        { key: 'assignedAssets', label: 'Assigned Assets', value: String(assigned) },
        { key: 'departments', label: 'Departments', value: String(depts) },
        { key: 'pendingAccept', label: 'Pending Accept', value: String(pending) },
      ];

    } else if (module === 'assignments') {
      const total = await Assignment.count();
      const accepted = await Assignment.count({ where: { status: 'Accepted' } });
      const pending = await Assignment.count({ where: { status: 'Pending' } });
      const damaged = await Asset.count({ where: { status: 'Damaged' } });
      stats = [
        { key: 'assigned', label: 'Assigned', value: String(total) },
        { key: 'accepted', label: 'Accepted', value: String(accepted) },
        { key: 'pending', label: 'Pending', value: String(pending) },
        { key: 'damaged', label: 'Damaged/Lost', value: String(damaged) },
      ];

    } else if (module === 'vendors') {
      const vendors = await Vendor.count();
      const products = await Asset.count();
      stats = [
        { key: 'vendors', label: 'Vendors', value: String(vendors) },
        { key: 'products', label: 'Products', value: String(products) },
      ];

    } else if (module === 'transfers') {
      const total = await Transfer.count();
      const pending = await Transfer.count({ where: { status: 'Pending' } });
      const confirmed = await Transfer.count({ where: { status: 'Approved' } });
      const rejected = await Transfer.count({ where: { status: 'Rejected' } });
      stats = [
        { key: 'transfers', label: 'Transfers', value: String(total) },
        { key: 'pending', label: 'Pending Approval', value: String(pending) },
        { key: 'confirmed', label: 'Confirmed', value: String(confirmed) },
        { key: 'rejected', label: 'Rejected', value: String(rejected) },
      ];

    } else if (module === 'repairs') {
      const open = await RepairRequest.count({ where: { status: { [Op.in]: ['Pending', 'Open'] } } });
      const assigned = await RepairRequest.count({ where: { status: 'In Progress' } });
      const completed = await RepairRequest.count({ where: { status: 'Completed' } });
      const avgCost = await RepairRequest.findOne({
        attributes: [[fn('AVG', col('cost')), 'avgCost']],
        raw: true,
      });
      const avg = avgCost && avgCost.avgCost ? `$${parseFloat(avgCost.avgCost).toFixed(0)}` : '$0';
      stats = [
        { key: 'open', label: 'Open Repairs', value: String(open) },
        { key: 'assigned', label: 'Assigned', value: String(assigned) },
        { key: 'completed', label: 'Completed', value: String(completed) },
        { key: 'avgCost', label: 'Avg Cost', value: avg },
      ];

    } else if (module === 'service') {
      const total = await MaintenanceRecord.count();
      const monthStart = new Date();
      monthStart.setDate(1);
      const thisMonth = await MaintenanceRecord.count({
        where: { performedDate: { [Op.gte]: monthStart } },
      });
      const totalCost = await MaintenanceRecord.sum('cost') || 0;
      const costYTD = totalCost >= 1000 ? `$${(totalCost / 1000).toFixed(1)}K` : `$${totalCost.toFixed(0)}`;
      stats = [
        { key: 'total', label: 'Service Entries', value: String(total) },
        { key: 'thisMonth', label: 'This Month', value: String(thisMonth) },
        { key: 'costYTD', label: 'Cost YTD', value: costYTD },
      ];

    } else if (module === 'warranty') {
      const today = new Date();
      const in90Days = new Date();
      in90Days.setDate(today.getDate() + 90);
      const active = await Asset.count({
        where: { warrantyExpiry: { [Op.gt]: in90Days } },
      });
      const expiringSoon = await Asset.count({
        where: { warrantyExpiry: { [Op.between]: [today, in90Days] } },
      });
      const expired = await Asset.count({
        where: { warrantyExpiry: { [Op.lt]: today } },
      });
      const total = await Asset.count({ where: { warrantyExpiry: { [Op.ne]: null } } });
      stats = [
        { key: 'active', label: 'Active Warranty', value: String(active) },
        { key: 'expiringSoon', label: 'Expiring Soon', value: String(expiringSoon) },
        { key: 'expired', label: 'Expired', value: String(expired) },
        { key: 'total', label: 'Total Tracked', value: String(total) },
      ];

    } else if (module === 'qr') {
      const total = await Asset.count();
      stats = [
        { key: 'total', label: 'QR Generated', value: String(total) },
        { key: 'assetPages', label: 'Asset Pages', value: String(total) },
      ];
    }

    return res.status(200).json({ module, stats });
  } catch (error) {
    console.error('Error fetching module stats:', error);
    return res.status(500).json({ message: 'Server error fetching module stats' });
  }
};

module.exports = {
  getDashboardStats,
  getModuleStats,
  exportExcel,
  exportPDF,
};
