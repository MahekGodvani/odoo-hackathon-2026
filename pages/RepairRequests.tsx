import { SystemModulePage } from './SystemModulePage';

export default function RepairRequests() {
  return (
    <SystemModulePage
      title="Repair Requests"
      description="Employees report issues, technicians resolve repairs, and admins close requests."
      icon="AlertTriangle"
      actions={[{ label: 'Create Repair', variant: 'primary', icon: 'Plus' }, { label: 'Assign Technician', icon: 'User' }]}
      stats={[
        { label: 'Open Repairs', value: '18', color: '#EF4444', bg: '#FEF2F2', icon: 'AlertTriangle' },
        { label: 'Assigned', value: '11', color: '#4F46E5', bg: '#EEF2FF', icon: 'User' },
        { label: 'Completed', value: '26', color: '#10B981', bg: '#ECFDF5', icon: 'CheckCircle' },
        { label: 'Avg Cost', value: '$184', color: '#F59E0B', bg: '#FFFBEB', icon: 'FileText' },
      ]}
      features={['Issue reporting', 'Technician assignment', 'Repair completion', 'Close request']}
      workflow={['Problem reported', 'Technician assigned', 'Repair completed', 'Close request']}
      records={[
        { id: 'REP-001', title: 'Printer not working', subtitle: 'HP LaserJet Pro · Operations', meta: ['Raised by John Doe', 'Technician: Tom Richards'], status: 'Open' },
        { id: 'REP-002', title: 'Laptop battery draining', subtitle: 'Dell Latitude 5420 · Computer Lab', meta: ['Parts required', 'Vendor quote pending'], status: 'Assigned' },
        { id: 'REP-003', title: 'Monitor flickering', subtitle: 'Dell Monitor 27" · Design', meta: ['Completed today', 'Cable replaced'], status: 'Completed' },
      ]}
    />
  );
}
