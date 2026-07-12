// src/data/mockData.ts
export const kpiCards = [
  { label: 'Available Assets', value: '1,284', subtitle: '+12 today', color: '#10B981', bg: '#ECFDF5', iconKey: 'Package' },
  { label: 'Allocated Assets', value: '847', subtitle: '66% utilization', color: '#4F46E5', bg: '#EEF2FF', iconKey: 'Users' },
  { label: 'Maintenance Requests', value: '23', subtitle: '5 critical', color: '#F59E0B', bg: '#FFFBEB', iconKey: 'Maintenance' },
  { label: "Today's Bookings", value: '56', subtitle: '8 pending', color: '#06B6D4', bg: '#ECFEFF', iconKey: 'Booking' },
  { label: 'Pending Transfers', value: '14', subtitle: '3 urgent', color: '#8B5CF6', bg: '#F5F3FF', iconKey: 'Truck' },
  { label: 'Upcoming Returns', value: '31', subtitle: 'Next 7 days', color: '#EC4899', bg: '#FDF2F8', iconKey: 'RotateCcw' },
];

export const overdueReturns = [
  { asset: 'MacBook Pro 16"', assignee: 'Sarah Chen', dueDate: '3 days overdue', dept: 'Engineering', id: 'AST-2847' },
  { asset: 'Dell Monitor 27"', assignee: 'Mike Johnson', dueDate: '2 days overdue', dept: 'Design', id: 'AST-1923' },
  { asset: 'iPad Pro 12.9"', assignee: 'Emily Davis', dueDate: '1 day overdue', dept: 'Marketing', id: 'AST-3341' },
  { asset: 'Logitech MX Keys', assignee: 'Alex Wong', dueDate: '5 days overdue', dept: 'Sales', id: 'AST-0892' },
];

export const maintenanceRequests = [
  { asset: 'HP LaserJet Pro', priority: 'Critical', assignee: 'Tom Richards', status: 'In Progress', id: 'MNT-001' },
  { asset: 'Cisco Switch 48P', priority: 'High', assignee: 'Lisa Park', status: 'Pending', id: 'MNT-002' },
  { asset: 'APC UPS 3000VA', priority: 'Medium', assignee: 'David Kim', status: 'Scheduled', id: 'MNT-003' },
  { asset: 'Epson Projector', priority: 'Low', assignee: 'Anna Lee', status: 'Completed', id: 'MNT-004' },
];

export const todaysBookings = [
  { resource: 'Conference Room A', time: '09:00 - 10:30', status: 'Confirmed', bookedBy: 'John Miller', id: 'BKG-001' },
  { resource: 'Tesla Model Y', time: '10:00 - 14:00', status: 'Active', bookedBy: 'Sarah Chen', id: 'BKG-002' },
  { resource: 'Meeting Room B2', time: '14:00 - 15:30', status: 'Upcoming', bookedBy: 'Mike Ross', id: 'BKG-003' },
  { resource: 'Projector Kit #3', time: '16:00 - 17:00', status: 'Pending', bookedBy: 'Lisa Wang', id: 'BKG-004' },
];

export const quickActions = [
  { label: 'Register Asset', iconKey: 'Plus', color: '#4F46E5', bg: '#EEF2FF', route: '/assets' },
  { label: 'Allocate Asset', iconKey: 'Send', color: '#10B981', bg: '#ECFDF5', route: '/assets' },
  { label: 'Book Resource', iconKey: 'Booking', color: '#06B6D4', bg: '#ECFEFF', route: '/resource-booking' },
  { label: 'Raise Maintenance', iconKey: 'Maintenance', color: '#F59E0B', bg: '#FFFBEB', route: '/maintenance' },
  { label: 'Start Audit', iconKey: 'Audit', color: '#8B5CF6', bg: '#F5F3FF', route: '/audits' },
  { label: 'Generate Report', iconKey: 'FileText', color: '#EC4899', bg: '#FDF2F8', route: '/reports' },
];

export const recentActivity = [
  { user: 'Sarah Chen', action: 'registered a new MacBook Pro 16" M3', time: '2 min ago', color: '#4F46E5', avatar: 'SC' },
  { user: 'Tom Richards', action: 'completed maintenance on HP LaserJet Pro', time: '15 min ago', color: '#10B981', avatar: 'TR' },
  { user: 'Emily Davis', action: 'booked Conference Room A for tomorrow', time: '32 min ago', color: '#06B6D4', avatar: 'ED' },
  { user: 'Mike Johnson', action: 'requested transfer of Dell Monitor 27"', time: '1 hour ago', color: '#8B5CF6', avatar: 'MJ' },
  { user: 'Lisa Park', action: 'started audit for IT Department assets', time: '2 hours ago', color: '#F59E0B', avatar: 'LP' },
];

export const notifications = [
  { type: 'success', title: 'Asset Registration Complete', desc: 'MacBook Pro #2847 successfully registered', time: '2 min ago' },
  { type: 'warning', title: 'Maintenance Overdue', desc: 'HP LaserJet Pro maintenance is past scheduled date', time: '30 min ago' },
  { type: 'reminder', title: 'Upcoming Audit', desc: 'IT Department audit starts tomorrow at 9:00 AM', time: '1 hour ago' },
  { type: 'info', title: 'Booking Confirmed', desc: 'Conference Room A booked for Dec 20, 2024', time: '3 hours ago' },
];

export const bottomSummary = [
  { label: 'Active Users', value: '142', color: '#4F46E5', bg: '#EEF2FF', iconKey: 'Users', status: 'Online now' },
  { label: 'Assets Registered Today', value: '18', color: '#10B981', bg: '#ECFDF5', iconKey: 'Package', status: '+3 this hour' },
  { label: 'System Health', value: '99.9%', color: '#06B6D4', bg: '#ECFEFF', iconKey: 'Activity', status: 'All systems operational' },
  { label: 'Pending Approvals', value: '12', color: '#F59E0B', bg: '#FFFBEB', iconKey: 'Shield', status: '5 high priority' },
];

export const allAssets = [
  { id: 'AST-2847', name: 'MacBook Pro 16" M3', category: 'Laptop', dept: 'Engineering', assignee: 'Sarah Chen', status: 'Allocated', location: 'HQ Floor 3', value: '$3,499', purchaseDate: '2024-01-15', warranty: '2027-01-15' },
  { id: 'AST-1923', name: 'Dell Monitor 27"', category: 'Monitor', dept: 'Design', assignee: 'Mike Johnson', status: 'Overdue', location: 'HQ Floor 2', value: '$899', purchaseDate: '2023-06-10', warranty: '2026-06-10' },
  { id: 'AST-3341', name: 'iPad Pro 12.9"', category: 'Tablet', dept: 'Marketing', assignee: 'Emily Davis', status: 'Overdue', location: 'HQ Floor 4', value: '$1,299', purchaseDate: '2023-11-20', warranty: '2025-11-20' },
  { id: 'AST-0892', name: 'Logitech MX Keys', category: 'Peripheral', dept: 'Sales', assignee: 'Alex Wong', status: 'Overdue', location: 'Remote', value: '$149', purchaseDate: '2023-03-05', warranty: '2026-03-05' },
  { id: 'AST-4412', name: 'HP LaserJet Pro', category: 'Printer', dept: 'Operations', assignee: 'Tom Richards', status: 'Maintenance', location: 'HQ Floor 1', value: '$599', purchaseDate: '2022-08-22', warranty: '2025-08-22' },
  { id: 'AST-5521', name: 'Cisco Switch 48P', category: 'Network', dept: 'IT', assignee: 'Lisa Park', status: 'Maintenance', location: 'Server Room', value: '$2,199', purchaseDate: '2022-02-14', warranty: '2025-02-14' },
  { id: 'AST-6678', name: 'iPhone 15 Pro', category: 'Mobile', dept: 'Sales', assignee: 'David Kim', status: 'Available', location: 'HQ Floor 5', value: '$1,099', purchaseDate: '2024-03-01', warranty: '2026-03-01' },
  { id: 'AST-7789', name: 'Sony WH-1000XM5', category: 'Headphones', dept: 'Engineering', assignee: 'Anna Lee', status: 'Available', location: 'HQ Floor 3', value: '$399', purchaseDate: '2024-02-10', warranty: '2026-02-10' },
];

export const allBookings = [
  { id: 'BKG-001', resource: 'Conference Room A', bookedBy: 'John Miller', dept: 'Management', time: '09:00 - 10:30', date: 'Today', status: 'Confirmed', type: 'Room' },
  { id: 'BKG-002', resource: 'Tesla Model Y', bookedBy: 'Sarah Chen', dept: 'Engineering', time: '10:00 - 14:00', date: 'Today', status: 'Active', type: 'Vehicle' },
  { id: 'BKG-003', resource: 'Meeting Room B2', bookedBy: 'Mike Ross', dept: 'Sales', time: '14:00 - 15:30', date: 'Today', status: 'Upcoming', type: 'Room' },
  { id: 'BKG-004', resource: 'Projector Kit #3', bookedBy: 'Lisa Wang', dept: 'Marketing', time: '16:00 - 17:00', date: 'Today', status: 'Pending', type: 'Equipment' },
  { id: 'BKG-005', resource: 'Training Lab A', bookedBy: 'James Brown', dept: 'HR', time: '09:00 - 12:00', date: 'Tomorrow', status: 'Confirmed', type: 'Room' },
  { id: 'BKG-006', resource: 'BMW 5 Series', bookedBy: 'Emma White', dept: 'Operations', time: '08:00 - 17:00', date: 'Tomorrow', status: 'Confirmed', type: 'Vehicle' },
];

export const allMaintenanceRequests = [
  { id: 'MNT-001', asset: 'HP LaserJet Pro', assetId: 'AST-4412', priority: 'Critical', assignee: 'Tom Richards', status: 'In Progress', type: 'Repair', raisedBy: 'John Doe', date: '2024-12-18', dept: 'Operations' },
  { id: 'MNT-002', asset: 'Cisco Switch 48P', assetId: 'AST-5521', priority: 'High', assignee: 'Lisa Park', status: 'Pending', type: 'Inspection', raisedBy: 'Sarah Chen', date: '2024-12-17', dept: 'IT' },
  { id: 'MNT-003', asset: 'APC UPS 3000VA', assetId: 'AST-8834', priority: 'Medium', assignee: 'David Kim', status: 'Scheduled', type: 'Preventive', raisedBy: 'Mike Johnson', date: '2024-12-16', dept: 'IT' },
  { id: 'MNT-004', asset: 'Epson Projector', assetId: 'AST-2210', priority: 'Low', assignee: 'Anna Lee', status: 'Completed', type: 'Cleaning', raisedBy: 'Emily Davis', date: '2024-12-15', dept: 'Marketing' },
  { id: 'MNT-005', asset: 'Dell PowerEdge R740', assetId: 'AST-9901', priority: 'Critical', assignee: 'Tom Richards', status: 'Pending', type: 'Hardware Failure', raisedBy: 'Alex Wong', date: '2024-12-14', dept: 'IT' },
];

export const allAudits = [
  { id: 'AUD-001', title: 'IT Department Assets', dept: 'IT', auditor: 'Lisa Park', status: 'In Progress', startDate: '2024-12-18', endDate: '2024-12-20', assets: 142, completed: 89, type: 'Full Audit' },
  { id: 'AUD-002', title: 'Engineering Laptops', dept: 'Engineering', auditor: 'Tom Richards', status: 'Scheduled', startDate: '2024-12-21', endDate: '2024-12-22', assets: 67, completed: 0, type: 'Spot Check' },
  { id: 'AUD-003', title: 'Office Furniture Q4', dept: 'Operations', auditor: 'Emily Davis', status: 'Completed', startDate: '2024-12-10', endDate: '2024-12-12', assets: 234, completed: 234, type: 'Full Audit' },
  { id: 'AUD-004', title: 'Marketing Equipment', dept: 'Marketing', auditor: 'John Miller', status: 'Overdue', startDate: '2024-12-05', endDate: '2024-12-07', assets: 45, completed: 32, type: 'Spot Check' },
];