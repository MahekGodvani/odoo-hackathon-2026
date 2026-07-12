const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'Role' }],
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Invalid email or inactive user account' });
    }

    console.log(`Login attempt for email: ${email}. Password length: ${password ? password.length : 0}`);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password comparison failed for ${email}`);
      return res.status(401).json({ message: 'Invalid password credentials' });
    }

    // Generate Access Token (15 minutes)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.Role.name },
      process.env.JWT_SECRET || 'supersecretjwtkey123!',
      { expiresIn: '15m' }
    );

    // Generate Refresh Token (7 days)
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.REFRESH_JWT_SECRET || 'supersecretrefreshkey123!',
      { expiresIn: '7d' }
    );

    // Save Refresh Token in Database
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.Role.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during authentication login' });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Verify Refresh Token signature
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET || 'supersecretrefreshkey123!'
    );

    const user = await User.findByPk(decoded.id, {
      include: [{ model: Role, as: 'Role' }],
    });

    if (!user || user.status !== 'active' || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid or revoked refresh token' });
    }

    // Issue new Access Token (15 minutes)
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.Role.name },
      process.env.JWT_SECRET || 'supersecretjwtkey123!',
      { expiresIn: '15m' }
    );

    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Invalidate locally if token is provided
    if (refreshToken) {
      const user = await User.findOne({ where: { refreshToken } });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    } else if (req.user) {
      // Invalidate if req.user is set (fallback)
      const user = await User.findByPk(req.user.id);
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Server error during logout' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'refreshToken'] },
      include: [{ model: Role, as: 'Role' }],
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Server error retrieving user profile' });
  }
};

module.exports = {
  login,
  refresh,
  logout,
  getProfile,
};
