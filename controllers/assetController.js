const QRCode = require('qrcode');
const { Op } = require('sequelize');
const { Asset, Category, Department, Vendor, Assignment, Transfer, MaintenanceRecord, RepairRequest, User } = require('../models');

// Helper to generate QR code string
const generateAssetQRCode = async (assetId) => {
  try {
    // Generate a deep link or data summary to encode
    const link = `http://localhost:5173/assets/${assetId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(link, {
      color: {
        dark: '#1e293b',  // Dark slate for premium styling
        light: '#ffffff'
      },
      width: 300
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    return null;
  }
};

const getAssets = async (req, res) => {
  try {
    const { categoryId, departmentId, status, condition, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (categoryId) whereClause.categoryId = categoryId;
    if (departmentId) whereClause.departmentId = departmentId;
    if (status) whereClause.status = status;
    if (condition) whereClause.condition = condition;

    if (search) {
      whereClause([Op.or]) = [
        { name: { [Op.like]: `%${search}%` } },
        { serialNumber: { [Op.like]: `%${search}%` } },
        { model: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Asset.findAndCountAll({
      where: whereClause,
      include: [
        { model: Category, as: 'Category', attributes: ['id', 'name', 'code'] },
        { model: Department, as: 'Department', attributes: ['id', 'name', 'code'] },
        { model: Vendor, as: 'Vendor', attributes: ['id', 'name'] },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit),
      assets: rows,
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return res.status(500).json({ message: 'Server error retrieving assets list' });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'Category' },
        { model: Department, as: 'Department', include: [{ model: User, as: 'Manager', attributes: ['id', 'name', 'email'] }] },
        { model: Vendor, as: 'Vendor' },
        { 
          model: Assignment, 
          as: 'Assignments',
          include: [{ model: User, as: 'Employee', attributes: ['id', 'name', 'email'] }],
          order: [['assignedDate', 'DESC']]
        },
        { 
          model: Transfer, 
          as: 'Transfers',
          include: [
            { model: Department, as: 'FromDepartment', attributes: ['id', 'name', 'code'] },
            { model: Department, as: 'ToDepartment', attributes: ['id', 'name', 'code'] },
          ],
          order: [['transferDate', 'DESC']]
        },
        { 
          model: MaintenanceRecord, 
          as: 'MaintenanceRecords',
          include: [{ model: User, as: 'Technician', attributes: ['id', 'name'] }],
          order: [['performedDate', 'DESC']]
        },
        { 
          model: RepairRequest, 
          as: 'RepairRequests',
          include: [{ model: User, as: 'Requester', attributes: ['id', 'name'] }],
          order: [['requestDate', 'DESC']]
        }
      ],
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    return res.status(200).json(asset);
  } catch (error) {
    console.error('Error fetching asset by id:', error);
    return res.status(500).json({ message: 'Server error retrieving asset details' });
  }
};

const createAsset = async (req, res) => {
  try {
    const { name, serialNumber, model, description, categoryId, departmentId, condition, purchaseDate, purchaseCost, vendorId, warrantyExpiry } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Asset name is required' });
    }

    // Check serialNumber duplicate
    if (serialNumber) {
      const existing = await Asset.findOne({ where: { serialNumber } });
      if (existing) {
        return res.status(400).json({ message: `Asset with serial number '${serialNumber}' already exists` });
      }
    }

    const asset = await Asset.create({
      name,
      serialNumber,
      model,
      description,
      categoryId: categoryId || null,
      departmentId: departmentId || null,
      status: 'Available',
      condition: condition || 'Excellent',
      purchaseDate: purchaseDate || null,
      purchaseCost: purchaseCost || null,
      vendorId: vendorId || null,
      warrantyExpiry: warrantyExpiry || null,
    });

    // Generate and save QR Code
    const qrCodeUrl = await generateAssetQRCode(asset.id);
    if (qrCodeUrl) {
      asset.qrCodeUrl = qrCodeUrl;
      await asset.save();
    }

    return res.status(201).json(asset);
  } catch (error) {
    console.error('Error creating asset:', error);
    return res.status(500).json({ message: 'Server error creating asset record' });
  }
};

const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, serialNumber, model, description, categoryId, departmentId, status, condition, purchaseDate, purchaseCost, vendorId, warrantyExpiry } = req.body;

    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    if (serialNumber && serialNumber !== asset.serialNumber) {
      const existing = await Asset.findOne({ where: { serialNumber } });
      if (existing) {
        return res.status(400).json({ message: `Asset with serial number '${serialNumber}' already exists` });
      }
    }

    // Capture old department for transfer history logging if it changes
    const oldDeptId = asset.departmentId;

    await asset.update({
      name: name !== undefined ? name : asset.name,
      serialNumber: serialNumber !== undefined ? serialNumber : asset.serialNumber,
      model: model !== undefined ? model : asset.model,
      description: description !== undefined ? description : asset.description,
      categoryId: categoryId !== undefined ? categoryId : asset.categoryId,
      departmentId: departmentId !== undefined ? departmentId : asset.departmentId,
      status: status !== undefined ? status : asset.status,
      condition: condition !== undefined ? condition : asset.condition,
      purchaseDate: purchaseDate !== undefined ? purchaseDate : asset.purchaseDate,
      purchaseCost: purchaseCost !== undefined ? purchaseCost : asset.purchaseCost,
      vendorId: vendorId !== undefined ? vendorId : asset.vendorId,
      warrantyExpiry: warrantyExpiry !== undefined ? warrantyExpiry : asset.warrantyExpiry,
    });

    // Log department transfer if changed
    if (departmentId !== undefined && oldDeptId !== departmentId && oldDeptId !== null) {
      await Transfer.create({
        assetId: asset.id,
        fromDepartmentId: oldDeptId,
        toDepartmentId: departmentId,
        transferDate: new Date(),
        approvedBy: req.user ? req.user.id : null,
        status: 'Approved',
        notes: 'Department changed via asset update form',
      });
    }

    // Regen QR code if serial number changed (in case we encode serial number or details link)
    if (serialNumber !== undefined) {
      const qrCodeUrl = await generateAssetQRCode(asset.id);
      if (qrCodeUrl) {
        asset.qrCodeUrl = qrCodeUrl;
        await asset.save();
      }
    }

    return res.status(200).json(asset);
  } catch (error) {
    console.error('Error updating asset:', error);
    return res.status(500).json({ message: 'Server error updating asset record' });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    await asset.destroy();
    return res.status(200).json({ message: 'Asset record deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    return res.status(500).json({ message: 'Server error deleting asset record' });
  }
};

const getAssetQRCode = async (req, res) => {
  try {
    const { id } = req.params;
    const asset = await Asset.findByPk(id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }
    
    let qrCodeUrl = asset.qrCodeUrl;
    if (!qrCodeUrl) {
      qrCodeUrl = await generateAssetQRCode(asset.id);
      if (qrCodeUrl) {
        asset.qrCodeUrl = qrCodeUrl;
        await asset.save();
      }
    }
    
    const { format } = req.query;
    if (format === 'image' && qrCodeUrl) {
      const base64Data = qrCodeUrl.replace(/^data:image\/png;base64,/, "");
      const img = Buffer.from(base64Data, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      return res.end(img);
    }
    
    return res.status(200).json({ qrCodeUrl });
  } catch (error) {
    console.error('Error fetching asset QR code:', error);
    return res.status(500).json({ message: 'Server error retrieving QR code' });
  }
};

const generateGeneralQRCode = async (req, res) => {
  try {
    const { text, width = 300 } = req.query;
    if (!text) {
      return res.status(400).json({ message: 'Text query parameter is required' });
    }
    
    const qrCodeDataUrl = await QRCode.toDataURL(text, {
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      },
      width: parseInt(width) || 300
    });
    
    const { format } = req.query;
    if (format === 'image') {
      const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
      const img = Buffer.from(base64Data, 'base64');
      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      });
      return res.end(img);
    }
    
    return res.status(200).json({ qrCodeUrl: qrCodeDataUrl });
  } catch (error) {
    console.error('Error generating general QR code:', error);
    return res.status(500).json({ message: 'Server error generating QR code' });
  }
};

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetQRCode,
  generateGeneralQRCode,
};
