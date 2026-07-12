// src/pages/ServiceHistory.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function ServiceHistory() {
  const mapRecord = (record: any): ModuleRecord => ({
    id: `SRV-${String(record.id).padStart(3, '0')}`,
    title: record.Asset?.name || 'Unknown Asset',
    subtitle: record.description || record.notes || 'Routine checkup completed',
    meta: [
      `Cost: $${record.cost || 0}`,
      `Date: ${record.performedDate ? new Date(record.performedDate).toLocaleDateString() : 'N/A'}`,
      `Notes: ${record.notes || 'None'}`
    ],
    status: record.status === 'completed' || record.status === 'Completed' ? 'Completed' : 'Review'
  });

  return (
    <SystemModulePage
      title="Service History"
      description="Store every repair, replacement, upgrade, and maintenance event for each asset."
      icon="Activity"
      actions={[{ label: 'Add Service Entry', variant: 'primary', icon: 'Plus' }, { label: 'Export History', icon: 'Download' }]}
      stats={[
        { label: 'Service Entries', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Activity' },
        { label: 'This Month', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'Calendar' },
        { label: 'Parts Changed', value: '—', color: '#06B6D4', bg: '#ECFEFF', icon: 'Maintenance' },
        { label: 'Cost YTD', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'FileText' },
      ]}
      features={['Repair history', 'Parts replaced', 'Upgrades', 'Maintenance cost', 'Technician notes']}
      workflow={['Issue found', 'Service performed', 'Parts recorded', 'History updated']}
      apiEndpoint="/maintenance/records"
      statsEndpoint="service"
      mapRecord={mapRecord}
    />
  );
}
