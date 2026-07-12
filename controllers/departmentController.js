const { Department, User } = require('../models');

const getDepartments = async (req, res) => {
  try {
    const depts = await Department.findAll({
      include: [{ model: User, as: 'Manager', attributes: ['id', 'name', 'email'] }],
      order: [['name', 'ASC']],
    });
    return res.status(200).json(depts);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving departments' });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { name, code, description, managerId } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const existing = await Department.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: `Department code '${code}' already exists` });
    }

    const dept = await Department.create({ name, code, description, managerId: managerId || null });
    return res.status(201).json(dept);
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating department' });
  }
};

const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, managerId } = req.body;

    const dept = await Department.findByPk(id);
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    if (code && code !== dept.code) {
      const existing = await Department.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({ message: `Department code '${code}' already exists` });
      }
    }

    await dept.update({
      name: name !== undefined ? name : dept.name,
      code: code !== undefined ? code : dept.code,
      description: description !== undefined ? description : dept.description,
      managerId: managerId !== undefined ? managerId : dept.managerId,
    });

    return res.status(200).json(dept);
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating department' });
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const dept = await Department.findByPk(id);
    if (!dept) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await dept.destroy();
    return res.status(200).json({ message: 'Department deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting department (verify no assets are linked)' });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
