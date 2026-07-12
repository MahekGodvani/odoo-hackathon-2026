const swaggerJSDoc = require('swagger-jsdoc');

const apiTree = [
  // 1. Authentication (6)
  { path: '/api/auth/register', method: 'post', tag: 'Authentication', summary: 'Register User' },
  { path: '/api/auth/login', method: 'post', tag: 'Authentication', summary: 'Login' },
  { path: '/api/auth/logout', method: 'post', tag: 'Authentication', summary: 'Logout' },
  { path: '/api/auth/profile', method: 'get', tag: 'Authentication', summary: 'Get Logged-in User' },
  { path: '/api/auth/profile', method: 'put', tag: 'Authentication', summary: 'Update Profile' },
  { path: '/api/auth/change-password', method: 'put', tag: 'Authentication', summary: 'Change Password' },

  // 2. Roles (6)
  { path: '/api/roles', method: 'get', tag: 'Roles', summary: 'Get all roles' },
  { path: '/api/roles', method: 'post', tag: 'Roles', summary: 'Create new role' },
  { path: '/api/roles/{id}', method: 'get', tag: 'Roles', summary: 'Get role by ID' },
  { path: '/api/roles/{id}', method: 'put', tag: 'Roles', summary: 'Update role' },
  { path: '/api/roles/{id}', method: 'delete', tag: 'Roles', summary: 'Delete role' },
  { path: '/api/roles/{id}/permissions', method: 'put', tag: 'Roles', summary: 'Update role permissions' },

  // 3. Departments (8)
  { path: '/api/departments', method: 'get', tag: 'Departments', summary: 'Get all departments' },
  { path: '/api/departments', method: 'post', tag: 'Departments', summary: 'Create new department' },
  { path: '/api/departments/{id}', method: 'get', tag: 'Departments', summary: 'Get department by ID' },
  { path: '/api/departments/{id}', method: 'put', tag: 'Departments', summary: 'Update department' },
  { path: '/api/departments/{id}', method: 'delete', tag: 'Departments', summary: 'Delete department' },
  { path: '/api/departments/{id}/assets', method: 'get', tag: 'Departments', summary: 'Get department assets' },
  { path: '/api/departments/{id}/employees', method: 'get', tag: 'Departments', summary: 'Get department employees' },
  { path: '/api/departments/{id}/history', method: 'get', tag: 'Departments', summary: 'Get department history' },

  // 4. Employees (10)
  { path: '/api/employees', method: 'get', tag: 'Employees', summary: 'Get all employees' },
  { path: '/api/employees', method: 'post', tag: 'Employees', summary: 'Create new employee' },
  { path: '/api/employees/{id}', method: 'get', tag: 'Employees', summary: 'Get employee by ID' },
  { path: '/api/employees/{id}', method: 'put', tag: 'Employees', summary: 'Update employee' },
  { path: '/api/employees/{id}', method: 'delete', tag: 'Employees', summary: 'Delete employee' },
  { path: '/api/employees/{id}/role', method: 'put', tag: 'Employees', summary: 'Update employee role' },
  { path: '/api/employees/{id}/status', method: 'put', tag: 'Employees', summary: 'Update employee status' },
  { path: '/api/employees/{id}/history', method: 'get', tag: 'Employees', summary: 'Get employee activity history' },
  { path: '/api/employees/search', method: 'get', tag: 'Employees', summary: 'Search employees' },
  { path: '/api/employees/filter', method: 'get', tag: 'Employees', summary: 'Filter employees' },

  // 5. Asset Categories (6)
  { path: '/api/categories', method: 'get', tag: 'Categories', summary: 'Get all categories' },
  { path: '/api/categories', method: 'post', tag: 'Categories', summary: 'Create category' },
  { path: '/api/categories/{id}', method: 'get', tag: 'Categories', summary: 'Get category by ID' },
  { path: '/api/categories/{id}', method: 'put', tag: 'Categories', summary: 'Update category' },
  { path: '/api/categories/{id}', method: 'delete', tag: 'Categories', summary: 'Delete category' },
  { path: '/api/categories/{id}/assets', method: 'get', tag: 'Categories', summary: 'Get assets in category' },

  // 6. Assets (11)
  { path: '/api/assets', method: 'get', tag: 'Assets', summary: 'Get all assets' },
  { path: '/api/assets', method: 'post', tag: 'Assets', summary: 'Create new asset' },
  { path: '/api/assets/{id}', method: 'get', tag: 'Assets', summary: 'Get asset by ID' },
  { path: '/api/assets/{id}', method: 'put', tag: 'Assets', summary: 'Update asset' },
  { path: '/api/assets/{id}', method: 'delete', tag: 'Assets', summary: 'Delete asset' },
  { path: '/api/assets/{id}/status', method: 'put', tag: 'Assets', summary: 'Update asset status' },
  { path: '/api/assets/{id}/history', method: 'get', tag: 'Assets', summary: 'Get asset audit history' },
  { path: '/api/assets/search', method: 'get', tag: 'Assets', summary: 'Search assets' },
  { path: '/api/assets/filter', method: 'get', tag: 'Assets', summary: 'Filter assets' },
  { path: '/api/assets/bulk-import', method: 'post', tag: 'Assets', summary: 'Bulk import assets' },
  { path: '/api/assets/export', method: 'get', tag: 'Assets', summary: 'Export assets list' },

  // 7. Allocations (7)
  { path: '/api/allocations', method: 'post', tag: 'Allocations', summary: 'Create asset allocation' },
  { path: '/api/allocations', method: 'get', tag: 'Allocations', summary: 'Get all allocations' },
  { path: '/api/allocations/{id}', method: 'get', tag: 'Allocations', summary: 'Get allocation by ID' },
  { path: '/api/allocations/{id}/return', method: 'put', tag: 'Allocations', summary: 'Return allocated asset' },
  { path: '/api/allocations/{id}/transfer', method: 'post', tag: 'Allocations', summary: 'Transfer allocation' },
  { path: '/api/allocations/{id}/cancel', method: 'put', tag: 'Allocations', summary: 'Cancel allocation' },
  { path: '/api/assets/{id}/allocation-history', method: 'get', tag: 'Allocations', summary: 'Get asset allocation history' },

  // 8. Bookings (9)
  { path: '/api/bookings', method: 'get', tag: 'Bookings', summary: 'Get all bookings' },
  { path: '/api/bookings', method: 'post', tag: 'Bookings', summary: 'Create new booking' },
  { path: '/api/bookings/{id}', method: 'get', tag: 'Bookings', summary: 'Get booking by ID' },
  { path: '/api/bookings/{id}', method: 'put', tag: 'Bookings', summary: 'Update booking' },
  { path: '/api/bookings/{id}', method: 'delete', tag: 'Bookings', summary: 'Delete booking' },
  { path: '/api/bookings/{id}/approve', method: 'put', tag: 'Bookings', summary: 'Approve booking request' },
  { path: '/api/bookings/{id}/reject', method: 'put', tag: 'Bookings', summary: 'Reject booking request' },
  { path: '/api/bookings/calendar', method: 'get', tag: 'Bookings', summary: 'Get bookings calendar view' },
  { path: '/api/bookings/conflict-check', method: 'get', tag: 'Bookings', summary: 'Check scheduling conflicts' },

  // 9. Maintenance (9)
  { path: '/api/maintenance', method: 'get', tag: 'Maintenance', summary: 'Get all maintenance tasks' },
  { path: '/api/maintenance', method: 'post', tag: 'Maintenance', summary: 'Create new maintenance ticket' },
  { path: '/api/maintenance/{id}', method: 'get', tag: 'Maintenance', summary: 'Get maintenance by ID' },
  { path: '/api/maintenance/{id}', method: 'put', tag: 'Maintenance', summary: 'Update maintenance details' },
  { path: '/api/maintenance/{id}/approve', method: 'put', tag: 'Maintenance', summary: 'Approve maintenance request' },
  { path: '/api/maintenance/{id}/start', method: 'put', tag: 'Maintenance', summary: 'Start maintenance task' },
  { path: '/api/maintenance/{id}/complete', method: 'put', tag: 'Maintenance', summary: 'Complete maintenance task' },
  { path: '/api/maintenance/{id}/reject', method: 'put', tag: 'Maintenance', summary: 'Reject maintenance request' },
  { path: '/api/maintenance/schedule', method: 'get', tag: 'Maintenance', summary: 'Get maintenance calendar schedule' },

  // 10. Audits (7)
  { path: '/api/audits', method: 'get', tag: 'Audits', summary: 'Get all audits' },
  { path: '/api/audits', method: 'post', tag: 'Audits', summary: 'Schedule new audit' },
  { path: '/api/audits/{id}', method: 'get', tag: 'Audits', summary: 'Get audit by ID' },
  { path: '/api/audits/{id}', method: 'put', tag: 'Audits', summary: 'Update audit status' },
  { path: '/api/audits/{id}', method: 'delete', tag: 'Audits', summary: 'Cancel audit' },
  { path: '/api/audits/{id}/verify', method: 'post', tag: 'Audits', summary: 'Verify audited asset' },
  { path: '/api/audits/{id}/report', method: 'get', tag: 'Audits', summary: 'Get audit report' },

  // 11. Notifications (4)
  { path: '/api/notifications', method: 'get', tag: 'Notifications', summary: 'Get all notifications' },
  { path: '/api/notifications/{id}/read', method: 'put', tag: 'Notifications', summary: 'Mark notification as read' },
  { path: '/api/notifications/read-all', method: 'put', tag: 'Notifications', summary: 'Mark all notifications as read' },
  { path: '/api/notifications/{id}', method: 'delete', tag: 'Notifications', summary: 'Delete notification' },

  // 12. Dashboard (6)
  { path: '/api/dashboard/summary', method: 'get', tag: 'Dashboard', summary: 'Get overall summary counts' },
  { path: '/api/dashboard/assets', method: 'get', tag: 'Dashboard', summary: 'Get assets summary' },
  { path: '/api/dashboard/bookings', method: 'get', tag: 'Dashboard', summary: 'Get bookings summary' },
  { path: '/api/dashboard/maintenance', method: 'get', tag: 'Dashboard', summary: 'Get maintenance summary' },
  { path: '/api/dashboard/audits', method: 'get', tag: 'Dashboard', summary: 'Get audits summary' },
  { path: '/api/dashboard/charts', method: 'get', tag: 'Dashboard', summary: 'Get analytical chart metrics' },

  // 13. Reports (7)
  { path: '/api/reports/assets', method: 'get', tag: 'Reports', summary: 'Generate assets report' },
  { path: '/api/reports/bookings', method: 'get', tag: 'Reports', summary: 'Generate bookings report' },
  { path: '/api/reports/maintenance', method: 'get', tag: 'Reports', summary: 'Generate maintenance report' },
  { path: '/api/reports/audits', method: 'get', tag: 'Reports', summary: 'Generate audits report' },
  { path: '/api/reports/utilization', method: 'get', tag: 'Reports', summary: 'Generate utilization report' },
  { path: '/api/reports/export/csv', method: 'get', tag: 'Reports', summary: 'Export data to CSV' },
  { path: '/api/reports/export/pdf', method: 'get', tag: 'Reports', summary: 'Export data to PDF' },

  // 14. Activity Log (2)
  { path: '/api/activity-logs', method: 'get', tag: 'Activity Logs', summary: 'Get all activity logs' },
  { path: '/api/activity-logs/{id}', method: 'get', tag: 'Activity Logs', summary: 'Get log detail by ID' },

  // 15. Search (3)
  { path: '/api/search/assets', method: 'get', tag: 'Search', summary: 'Search assets' },
  { path: '/api/search/employees', method: 'get', tag: 'Search', summary: 'Search employees' },
  { path: '/api/search/bookings', method: 'get', tag: 'Search', summary: 'Search bookings' },

  // 16. Validation (3)
  { path: '/api/validation/asset-available/{id}', method: 'get', tag: 'Validation', summary: 'Check asset availability status' },
  { path: '/api/validation/employee-available/{id}', method: 'get', tag: 'Validation', summary: 'Check employee status' },
  { path: '/api/validation/booking-conflict', method: 'get', tag: 'Validation', summary: 'Check scheduling conflicts' },

  // 17. Analytics (4)
  { path: '/api/analytics/asset-utilization', method: 'get', tag: 'Analytics', summary: 'Get utilization analytics' },
  { path: '/api/analytics/department-usage', method: 'get', tag: 'Analytics', summary: 'Get department utilization' },
  { path: '/api/analytics/maintenance-cost', method: 'get', tag: 'Analytics', summary: 'Get maintenance cost metrics' },
  { path: '/api/analytics/monthly-summary', method: 'get', tag: 'Analytics', summary: 'Get monthly summary analytics' },
];

const paths = {};

apiTree.forEach((api) => {
  if (!paths[api.path]) {
    paths[api.path] = {};
  }
  
  const parameters = [];
  if (api.path.includes('{id}')) {
    parameters.push({
      name: 'id',
      in: 'path',
      required: true,
      schema: { type: 'string' },
      description: 'The unique identifier'
    });
  }

  const isPublicAuth = api.tag === 'Authentication' && 
    (api.path.includes('login') || api.path.includes('register') || api.path.includes('refresh'));

  paths[api.path][api.method] = {
    summary: api.summary,
    tags: [api.tag],
    security: isPublicAuth ? [] : [{ bearerAuth: [] }],
    parameters,
    requestBody: api.method === 'post' || api.method === 'put' ? {
      content: {
        'application/json': {
          schema: {
            type: 'object'
          }
        }
      }
    } : undefined,
    responses: {
      200: { description: 'Success' },
      401: { description: 'Unauthorized' },
      500: { description: 'Server Error' }
    }
  };
});

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'AssetFlow ERP API Documentation',
    version: '1.0.0',
    description: 'Complete Relational Enterprise Asset Management (ERP) REST API specification tree containing exactly 108 endpoints.',
    contact: {
      name: 'AssetFlow Engineering',
      email: 'support@assetflow.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Input token: "Bearer {accessToken}"'
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths,
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
