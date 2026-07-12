const { Asset, Category, Department, User, RepairRequest, MaintenanceRecord } = require('../models');
const { Op, fn, col } = require('sequelize');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

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

module.exports = {
  getDashboardStats,
  exportExcel,
  exportPDF,
};
