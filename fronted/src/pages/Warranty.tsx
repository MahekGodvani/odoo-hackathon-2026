// src/pages/Warranty.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function Warranty() {
  const mapRecord = (asset: any): ModuleRecord => {
    const expiry = asset.warrantyExpiry ? new Date(asset.warrantyExpiry) : null;
    const now = new Date();
    let status = 'No Warranty';
    let subtitle = 'No warranty registered';
    let remainingText = '';

    if (expiry) {
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        status = 'Expired';
        subtitle = `Warranty ended on ${expiry.toLocaleDateString()}`;
      } else if (diffDays <= 90) {
        status = 'Due Soon';
        subtitle = `Warranty ends on ${expiry.toLocaleDateString()} (${diffDays} days left)`;
      } else {
        status = 'Active';
        subtitle = `Warranty ends on ${expiry.toLocaleDateString()}`;
        remainingText = `${diffDays} days remaining`;
      }
    }

    return {
      id: `WAR-${String(asset.id).padStart(3, '0')}`,
      title: asset.name,
      subtitle: subtitle,
      meta: [
        `Serial: ${asset.serialNumber || 'N/A'}`,
        `Vendor: ${asset.Vendor?.name || 'Internal'}`,
        remainingText
      ].filter(Boolean),
      status: status
    };
  };

  return (
    <SystemModulePage
      title="Warranty Tracking"
      description="Track warranty start, end, remaining days, expired assets, renewals, and alerts."
      icon="Shield"
      actions={[{ label: 'Renew Warranty', variant: 'primary', icon: 'Shield' }, { label: 'Export Report', icon: 'Download' }]}
      stats={[
        { label: 'Active Warranty', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'Shield' },
        { label: 'Expiring Soon', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
        { label: 'Expired', value: '—', color: '#EF4444', bg: '#FEF2F2', icon: 'AlertTriangle' },
        { label: 'Total Tracked', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'RotateCcw' },
      ]}
      features={['Warranty start', 'Warranty end', 'Warranty remaining', 'Expired warranty', 'Renew warranty', 'Notifications']}
      workflow={['Track purchase', 'Monitor warranty', 'Notify before expiry', 'Renew or close']}
      apiEndpoint="/assets"
      statsEndpoint="warranty"
      mapRecord={mapRecord}
    />
  );
}
