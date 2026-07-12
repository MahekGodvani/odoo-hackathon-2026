const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(403).json({ message: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(403).json({ message: 'Access token is missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123!');
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'Role' }],
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'User not found or inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired authorization token' });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.Role) {
      return res.status(403).json({ message: 'Role authorization denied' });
    }

    if (roles.includes(req.user.Role.name)) {
      next();
    } else {
      return res.status(403).json({ message: `Forbidden: requires role ${roles.join(' or ')}` });
    }
  };
};

module.exports = {
  verifyToken,
  isAdmin: checkRole(['Admin']),
  isManager: checkRole(['Admin', 'Manager']),
  isTech: checkRole(['Admin', 'Technician']),
  isStaff: checkRole(['Admin', 'Manager', 'Technician']), // any staff member
};
