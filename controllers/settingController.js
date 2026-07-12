const { Setting } = require('../models');

const getSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll();
    const config = {};
    settings.forEach(s => {
      config[s.key] = s.value;
    });
    return res.status(200).json(config);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving system settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    for (const key in updates) {
      const setting = await Setting.findOne({ where: { key } });
      if (setting) {
        setting.value = updates[key].toString();
        await setting.save();
      }
    }
    return res.status(200).json({ message: 'System settings updated successfully' });
  } catch (error) {
    console.error('Error updating settings:', error);
    return res.status(500).json({ message: 'Error updating system settings' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
