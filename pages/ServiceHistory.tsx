import { SystemModulePage } from './SystemModulePage';

export default function ServiceHistory() {
  return (
    <SystemModulePage
      title="Service History"
      description="Store every repair, replacement, upgrade, and maintenance event for each asset."
      icon="Activity"
      actions={[{ label: 'Add Service Entry', variant: 'primary', icon: 'Plus' }, { label: 'Export History', icon: 'Download' }]}
      stats={[
        { label: 'Service Entries', value: '384', color: '#4F46E5', bg: '#EEF2FF', icon: 'Activity' },
        { label: 'This Month', value: '42', color: '#10B981', bg: '#ECFDF5', icon: 'Calendar' },
        { label: 'Parts Changed', value: '91', color: '#06B6D4', bg: '#ECFEFF', icon: 'Maintenance' },
        { label: 'Cost YTD', value: '$18.4K', color: '#F59E0B', bg: '#FFFBEB', icon: 'FileText' },
      ]}
      features={['Repair history', 'Parts replaced', 'Upgrades', 'Maintenance cost', 'Technician notes']}
      workflow={['Issue found', 'Service performed', 'Parts recorded', 'History updated']}
      records={[
        { id: 'SRV-001', title: 'Dell Latitude 5420', subtitle: 'Battery changed', meta: ['Cost: $120', 'Technician: Tom Richards', '2024-12-10'], status: 'Completed' },
        { id: 'SRV-002', title: 'Computer Lab Dell PCs', subtitle: 'RAM inspection completed', meta: ['20 devices checked', '18 failures found'], status: 'Review' },
        { id: 'SRV-003', title: 'MacBook Pro 16" M3', subtitle: 'Keyboard cleaned and diagnostics passed', meta: ['Cost: $0', 'Warranty service'], status: 'Completed' },
      ]}
    />
  );
}
