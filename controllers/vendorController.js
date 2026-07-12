const { Vendor } = require('../models');

const getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json(vendors);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving vendors' });
  }
};

const createVendor = async (req, res) => {
  try {
    const { name, contactName, email, phone, address } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Vendor name is required' });
    }

    const vendor = await Vendor.create({ name, contactName, email, phone, address });
    return res.status(201).json(vendor);
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating vendor' });
  }
};

const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, contactName, email, phone, address } = req.body;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await vendor.update({
      name: name !== undefined ? name : vendor.name,
      contactName: contactName !== undefined ? contactName : vendor.contactName,
      email: email !== undefined ? email : vendor.email,
      phone: phone !== undefined ? phone : vendor.phone,
      address: address !== undefined ? address : vendor.address,
    });

    return res.status(200).json(vendor);
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating vendor' });
  }
};

const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findByPk(id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    await vendor.destroy();
    return res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting vendor' });
  }
};

module.exports = {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor,
};
