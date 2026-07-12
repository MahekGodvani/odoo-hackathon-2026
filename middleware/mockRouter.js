const express = require('express');
const router = express.Router();

// Mock Data Stores for Hackathon Demo UI
const mockRoles = [
  { id: 1, name: 'Admin', description: 'System Administrator' },
  { id: 2, name: 'Manager', description: 'Department Manager' },
  { id: 3, name: 'Technician', description: 'Maintenance Specialist' },
  { id: 4, name: 'Employee', description: 'Regular Staff Member' }
];

const mockEmployees = [
  { id: 101, name: 'John Doe', email: 'john@assetflow.com', role: 'Employee', status: 'active', department: 'IT Support' },
  { id: 102, name: 'Jane Smith', email: 'jane@assetflow.com', role: 'Manager', status: 'active', department: 'Operations' },
  { id: 103, name: 'Bob Johnson', email: 'bob@assetflow.com', role: 'Technician', status: 'active', department: 'Facilities' }
];

let mockBookings = [
  { id: 1, resourceId: 'Conference Room A', bookedBy: 'John Doe', type: 'Room', startDate: '2026-07-15', endDate: '2026-07-15', time: '10:00 AM - 12:00 PM', status: 'confirmed' },
  { id: 2, resourceId: 'Team Van #02', bookedBy: 'Jane Smith', type: 'Vehicle', startDate: '2026-07-18', endDate: '2026-07-18', time: '09:00 AM - 05:00 PM', status: 'pending' }
];

const mockAudits = [
  { id: 1, name: 'Annual IT Audit', scheduledDate: '2026-08-01', status: 'scheduled', auditor: 'Mahek Godvani' },
  { id: 2, name: 'Q3 Facilities Audit', scheduledDate: '2026-09-15', status: 'draft', auditor: 'Jaimil Trivedi' }
];

const mockActivityLogs = [
  { id: 501, userId: 1, userName: 'Admin User', action: 'CHECKOUT_ASSET', target: 'Asset #1', timestamp: '2026-07-12T10:15:00Z' },
  { id: 502, userId: 2, userName: 'Manager User', action: 'CREATE_MAINTENANCE', target: 'Schedule #2', timestamp: '2026-07-12T10:20:00Z' }
];

let mockNotifications = [
  { id: 1, type: 'success', title: 'Asset Registration Complete', desc: 'MacBook Pro #2847 successfully registered by Admin', time: '2 min ago', read: false },
  { id: 2, type: 'warning', title: 'Maintenance Overdue', desc: 'HP LaserJet Pro maintenance is past scheduled date', time: '30 min ago', read: false },
  { id: 3, type: 'reminder', title: 'Upcoming Audit', desc: 'IT Department audit starts tomorrow at 9:00 AM', time: '1 hour ago', read: false },
  { id: 4, type: 'info', title: 'Booking Confirmed', desc: 'Conference Room A booked for next week', time: '3 hours ago', read: false },
  { id: 5, type: 'warning', title: 'Asset Return Overdue', desc: 'Dell Monitor #1923 assigned to staff is overdue', time: '5 hours ago', read: true },
];

// Fallback Mock Router handler
router.all('*', (req, res, next) => {
  const urlPath = req.path.toLowerCase().replace(/\/$/, ''); // Normalize trailing slashes
  const method = req.method.toLowerCase();

  // Roles Endpoints
  if (urlPath === '/roles') {
    if (method === 'get') return res.status(200).json(mockRoles);
    if (method === 'post') return res.status(201).json({ message: 'Role created successfully', role: { id: 5, ...req.body } });
  }
  if (urlPath.startsWith('/roles/')) {
    if (method === 'get') return res.status(200).json(mockRoles[0]);
    if (method === 'put') return res.status(200).json({ message: 'Role updated successfully', role: req.body });
    if (method === 'delete') return res.status(200).json({ message: 'Role deleted successfully' });
  }

  // Employees Endpoints
  if (urlPath === '/employees') {
    if (method === 'get') return res.status(200).json(mockEmployees);
    if (method === 'post') return res.status(201).json({ message: 'Employee created successfully', employee: { id: 104, ...req.body } });
  }
  if (urlPath.startsWith('/employees/') && urlPath.endsWith('/role')) {
    return res.status(200).json({ message: 'Employee role updated successfully' });
  }
  if (urlPath.startsWith('/employees/') && urlPath.endsWith('/status')) {
    return res.status(200).json({ message: 'Employee status updated successfully' });
  }
  if (urlPath.startsWith('/employees/') && urlPath.endsWith('/history')) {
    return res.status(200).json(mockActivityLogs.slice(0, 1));
  }
  if (urlPath.startsWith('/employees/')) {
    if (method === 'get') return res.status(200).json(mockEmployees[0]);
    if (method === 'put') return res.status(200).json({ message: 'Employee updated successfully', employee: req.body });
    if (method === 'delete') return res.status(200).json({ message: 'Employee deleted successfully' });
  }

  // Bookings Endpoints
  if (urlPath === '/bookings') {
    if (method === 'get') return res.status(200).json(mockBookings);
    if (method === 'post') {
      const newBooking = { id: Date.now(), status: 'pending', ...req.body };
      mockBookings.push(newBooking);
      return res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
    }
  }
  if (urlPath.startsWith('/bookings/')) {
    const bookingId = parseInt(urlPath.split('/bookings/')[1]);
    if (urlPath.endsWith('/approve')) return res.status(200).json({ message: 'Booking request approved successfully' });
    if (urlPath.endsWith('/reject')) return res.status(200).json({ message: 'Booking request rejected successfully' });
    if (urlPath === '/bookings/calendar') return res.status(200).json(mockBookings);
    if (urlPath === '/bookings/conflict-check') return res.status(200).json({ conflict: false, message: 'No scheduling conflicts found' });

    if (method === 'get') {
      const booking = mockBookings.find(b => b.id === bookingId);
      return res.status(booking ? 200 : 404).json(booking || { message: 'Booking not found' });
    }
    if (method === 'put') {
      const idx = mockBookings.findIndex(b => b.id === bookingId);
      if (idx !== -1) mockBookings[idx] = { ...mockBookings[idx], ...req.body };
      return res.status(200).json({ message: 'Booking updated successfully', booking: mockBookings[idx] });
    }
    if (method === 'delete') {
      const idx = mockBookings.findIndex(b => b.id === bookingId);
      if (idx !== -1) mockBookings.splice(idx, 1);
      return res.status(200).json({ message: 'Booking deleted successfully' });
    }
  }

  // Audits Endpoints
  if (urlPath === '/audits') {
    if (method === 'get') return res.status(200).json(mockAudits);
    if (method === 'post') return res.status(201).json({ message: 'Audit scheduled successfully', audit: { id: 3, ...req.body } });
  }
  if (urlPath.startsWith('/audits/')) {
    if (urlPath.endsWith('/verify')) return res.status(200).json({ message: 'Audit asset verification recorded' });
    if (urlPath.endsWith('/report')) return res.status(200).json({ message: 'Audit report compiled successfully', summary: 'All assets verified.' });
    
    if (method === 'get') return res.status(200).json(mockAudits[0]);
    if (method === 'put') return res.status(200).json({ message: 'Audit status updated successfully' });
    if (method === 'delete') return res.status(200).json({ message: 'Audit cancelled successfully' });
  }

  // Search Endpoints
  if (urlPath.startsWith('/search/')) {
    if (urlPath === '/search/assets') return res.status(200).json({ results: [{ id: 1, name: 'MacBook Pro 16' }] });
    if (urlPath === '/search/employees') return res.status(200).json({ results: mockEmployees });
    if (urlPath === '/search/bookings') return res.status(200).json({ results: mockBookings });
  }

  // Validation Endpoints
  if (urlPath.startsWith('/validation/')) {
    if (urlPath.startsWith('/validation/asset-available/')) return res.status(200).json({ available: true, message: 'Asset is currently available' });
    if (urlPath.startsWith('/validation/employee-available/')) return res.status(200).json({ status: 'active', message: 'Employee is active' });
    if (urlPath === '/validation/booking-conflict') return res.status(200).json({ conflict: false, message: 'No scheduling conflicts found' });
  }

  // Analytics Endpoints
  if (urlPath.startsWith('/analytics/')) {
    if (urlPath === '/analytics/asset-utilization') return res.status(200).json({ utilizationRate: 85.4, activeCount: 120, totalCount: 140 });
    if (urlPath === '/analytics/department-usage') return res.status(200).json({ usage: { 'IT Support': 45, 'Operations': 30, 'Finance': 25 } });
    if (urlPath === '/analytics/maintenance-cost') return res.status(200).json({ monthlyCost: 1250, yearlyProjection: 15000 });
    if (urlPath === '/analytics/monthly-summary') return res.status(200).json({ months: ['Jan', 'Feb', 'Mar'], activeSchedules: [12, 15, 14] });
  }

  // Activity Logs
  if (urlPath === '/activity-logs') {
    return res.status(200).json(mockActivityLogs);
  }
  if (urlPath.startsWith('/activity-logs/')) {
    return res.status(200).json(mockActivityLogs[0]);
  }

  // Allocations
  if (urlPath === '/allocations') {
    return res.status(200).json([]);
  }
  if (urlPath.startsWith('/allocations/')) {
    if (urlPath.endsWith('/return')) return res.status(200).json({ message: 'Allocation returned successfully' });
    if (urlPath.endsWith('/transfer')) return res.status(200).json({ message: 'Allocation transferred successfully' });
    if (urlPath.endsWith('/cancel')) return res.status(200).json({ message: 'Allocation cancelled successfully' });
  }

  // Categories extra
  if (urlPath.startsWith('/categories/') && urlPath.endsWith('/assets')) {
    return res.status(200).json({ categoryId: 1, assets: [] });
  }

  // Assets extra
  if (urlPath.startsWith('/assets/')) {
    if (urlPath.endsWith('/status')) return res.status(200).json({ message: 'Asset status updated successfully' });
    if (urlPath.endsWith('/history')) return res.status(200).json({ history: [] });
    if (urlPath.endsWith('/allocation-history')) return res.status(200).json({ history: [] });
    if (urlPath === '/assets/search') return res.status(200).json([]);
    if (urlPath === '/assets/filter') return res.status(200).json([]);
    if (urlPath === '/assets/bulk-import') return res.status(200).json({ message: 'Bulk import successful' });
    if (urlPath === '/assets/export') return res.status(200).json({ downloadUrl: '/api/reports/export/csv' });
  }

  // Notifications
  if (urlPath === '/notifications') {
    if (method === 'get') {
      return res.status(200).json(mockNotifications);
    }
  }
  if (urlPath === '/notifications/read-all') {
    mockNotifications = mockNotifications.map(n => ({ ...n, read: true }));
    return res.status(200).json({ message: 'All notifications marked as read', notifications: mockNotifications });
  }
  if (urlPath.startsWith('/notifications/')) {
    const parts = urlPath.split('/');
    const cleanId = Number(parts[2]);
    if (urlPath.endsWith('/read')) {
      mockNotifications = mockNotifications.map(n => n.id === cleanId ? { ...n, read: true } : n);
      return res.status(200).json({ message: 'Notification marked as read' });
    }
    if (method === 'delete') {
      mockNotifications = mockNotifications.filter(n => n.id !== cleanId);
      return res.status(200).json({ message: 'Notification deleted successfully' });
    }
  }

  // Dashboard extra
  if (urlPath.startsWith('/dashboard/')) {
    if (urlPath === '/dashboard/summary') return res.status(200).json({ totalAssets: 140, totalBookings: 24, totalMaintenance: 8 });
    if (urlPath === '/dashboard/assets') return res.status(200).json({ active: 120, draft: 10, retired: 10 });
    if (urlPath === '/dashboard/bookings') return res.status(200).json({ approved: 20, pending: 4 });
    if (urlPath === '/dashboard/maintenance') return res.status(200).json({ pending: 5, in_progress: 3 });
    if (urlPath === '/dashboard/audits') return res.status(200).json({ scheduled: 2, completed: 5 });
    if (urlPath === '/dashboard/charts') return res.status(200).json({ chartData: [] });
  }

  // Reports extra
  if (urlPath.startsWith('/reports/')) {
    if (urlPath === '/reports/assets') return res.status(200).json([]);
    if (urlPath === '/reports/bookings') return res.status(200).json([]);
    if (urlPath === '/reports/maintenance') return res.status(200).json([]);
    if (urlPath === '/reports/audits') return res.status(200).json([]);
    if (urlPath === '/reports/utilization') return res.status(200).json([]);
    if (urlPath === '/reports/export/csv') return res.status(200).json({ message: 'CSV compiled' });
    if (urlPath === '/reports/export/pdf') return res.status(200).json({ message: 'PDF compiled' });
  }

  next();
});

module.exports = router;
