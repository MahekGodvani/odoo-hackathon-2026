const { Category } = require('../models');

const getCategories = async (req, res) => {
  try {
    const cats = await Category.findAll({ order: [['name', 'ASC']] });
    return res.status(200).json(cats);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving categories' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, code, description } = req.body;
    if (!name || !code) {
      return res.status(400).json({ message: 'Name and code are required' });
    }

    const existing = await Category.findOne({ where: { code } });
    if (existing) {
      return res.status(400).json({ message: `Category code '${code}' already exists` });
    }

    const cat = await Category.create({ name, code, description });
    return res.status(201).json(cat);
  } catch (error) {
    return res.status(500).json({ message: 'Server error creating category' });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description } = req.body;

    const cat = await Category.findByPk(id);
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (code && code !== cat.code) {
      const existing = await Category.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({ message: `Category code '${code}' already exists` });
      }
    }

    await cat.update({
      name: name !== undefined ? name : cat.name,
      code: code !== undefined ? code : cat.code,
      description: description !== undefined ? description : cat.description,
    });

    return res.status(200).json(cat);
  } catch (error) {
    return res.status(500).json({ message: 'Server error updating category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const cat = await Category.findByPk(id);
    if (!cat) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await cat.destroy();
    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error deleting category (verify no assets are linked)' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
