const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const assignmentRoutes = require('./routes/assignments');
const transferRoutes = require('./routes/transfers');
const maintenanceRoutes = require('./routes/maintenance');
const repairRoutes = require('./routes/repairs');
const departmentRoutes = require('./routes/departments');
const categoryRoutes = require('./routes/categories');
const vendorRoutes = require('./routes/vendors');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const settingRoutes = require('./routes/settings');
const aiRoutes = require('./routes/ai');
const notificationRoutes = require('./routes/notifications');
const assetRequestRoutes = require('./routes/assetRequests');

const helmet = require('helmet');
const { generalLimiter, authLimiter } = require('./middleware/rateLimiter');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();

// Apply security headers and middleware
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use('/api/auth/login', authLimiter);
app.use('/api', generalLimiter);

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
// Serve uploads statically
app.use('/uploads', express.static(uploadsDir));

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/transfers', transferRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/repairs', repairRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/asset-requests', assetRequestRoutes);

const mockRouter = require('./middleware/mockRouter');
app.use('/api', mockRouter);

// Fallback Route for API
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the AssetFlow API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error occurred on backend' });
});

module.exports = app;
