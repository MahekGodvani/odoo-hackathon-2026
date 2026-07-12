import { SystemModulePage } from './SystemModulePage';

export default function Warranty() {
  return (
    <SystemModulePage
      title="Warranty Tracking"
      description="Track warranty start, end, remaining days, expired assets, renewals, and alerts."
      icon="Shield"
      actions={[{ label: 'Renew Warranty', variant: 'primary', icon: 'Shield' }, { label: 'Export Report', icon: 'Download' }]}
      stats={[
        { label: 'Active Warranty', value: '1,748', color: '#10B981', bg: '#ECFDF5', icon: 'Shield' },
        { label: 'Expiring Soon', value: '64', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
        { label: 'Expired', value: '319', color: '#EF4444', bg: '#FEF2F2', icon: 'AlertTriangle' },
        { label: 'Renewals', value: '22', color: '#4F46E5', bg: '#EEF2FF', icon: 'RotateCcw' },
      ]}
      features={['Warranty start', 'Warranty end', 'Warranty remaining', 'Expired warranty', 'Renew warranty', 'Notifications']}
      workflow={['Track purchase', 'Monitor warranty', 'Notify before expiry', 'Renew or close']}
      records={[
        { id: 'WAR-001', title: 'MacBook Pro 16" M3', subtitle: 'Warranty ends 2027-01-15', meta: ['Remaining: 918 days', 'Vendor: Apple'], status: 'Active' },
        { id: 'WAR-002', title: 'Cisco Switch 48P', subtitle: 'Warranty ends 2025-02-14', meta: ['Expired', 'Vendor: Cisco'], status: 'Expired' },
        { id: 'WAR-003', title: 'APC UPS 3000VA', subtitle: 'Warranty ends in 34 days', meta: ['Renewal recommended', 'Vendor quote needed'], status: 'Due Soon' },
      ]}
    />
  );
}
