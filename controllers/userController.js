const bcrypt = require('bcrypt');
const { User, Role } = require('../models');

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [{ model: Role, as: 'Role', attributes: ['id', 'name', 'description'] }],
      order: [['name', 'ASC']],
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving users' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId, status } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Name, email, password, and roleId are required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: `User with email '${email}' already exists` });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Specified Role does not exist' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      roleId,
      status: status || 'active',
    });

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(201).json(userResponse);
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Server error creating user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, roleId, status } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (email && email !== user.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({ message: `User with email '${email}' already exists` });
      }
    }

    const updateData = {
      name: name !== undefined ? name : user.name,
      email: email !== undefined ? email : user.email,
      status: status !== undefined ? status : user.status,
      roleId: roleId !== undefined ? roleId : user.roleId,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await user.update(updateData);

    const userResponse = user.toJSON();
    delete userResponse.password;

    return res.status(200).json(userResponse);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error updating user' });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
};
