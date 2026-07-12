// src/pages/RepairRequests.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function RepairRequests() {
  const mapRecord = (repair: any): ModuleRecord => ({
    id: `REP-${String(repair.id).padStart(3, '0')}`,
    title: repair.Asset?.name || 'Unknown Asset',
    subtitle: repair.description || 'No details provided',
    meta: [
      `Raised By: ${repair.Requester?.name || 'System User'}`,
      `Priority: ${repair.priority || 'Medium'}`,
      `Requested: ${new Date(repair.requestDate).toLocaleDateString()}`
    ],
    status: repair.status || 'Pending'
  });

  return (
    <SystemModulePage
      title="Repair Requests"
      description="Employees report issues, technicians resolve repairs, and admins close requests."
      icon="AlertTriangle"
      actions={[{ label: 'Create Repair', variant: 'primary', icon: 'Plus' }, { label: 'Assign Technician', icon: 'User' }]}
      stats={[
        { label: 'Open Repairs', value: '—', color: '#EF4444', bg: '#FEF2F2', icon: 'AlertTriangle' },
        { label: 'Assigned', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'User' },
        { label: 'Completed', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'CheckCircle' },
        { label: 'Avg Cost', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'FileText' },
      ]}
      features={['Issue reporting', 'Technician assignment', 'Repair completion', 'Close request']}
      workflow={['Problem reported', 'Technician assigned', 'Repair completed', 'Close request']}
      apiEndpoint="/repairs"
      statsEndpoint="repairs"
      mapRecord={mapRecord}
    />
  );
}
