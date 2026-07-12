// src/pages/QRTracking.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function QRTracking() {
  const mapRecord = (asset: any): ModuleRecord => {
    const warrantyExpiry = asset.warrantyExpiry ? new Date(asset.warrantyExpiry) : null;
    const now = new Date();
    let warrantyText = 'No warranty info';
    if (warrantyExpiry) {
      const diffDays = Math.ceil((warrantyExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 0) warrantyText = 'Warranty expired';
      else warrantyText = `Warranty: ${diffDays} days left`;
    }

    return {
      id: asset.serialNumber || `AS${String(asset.id).padStart(6, '0')}`,
      title: asset.name || 'Unknown Asset',
      subtitle: `${asset.Department?.name || 'Unassigned'} · Owner: ${asset.assignedEmployee?.name || 'Unassigned'}`,
      meta: [
        warrantyText,
        `Condition: ${asset.condition || 'Good'}`,
        `Location: ${asset.location || asset.Department?.name || 'N/A'}`
      ],
      status: asset.status || 'Available'
    };
  };

  return (
    <SystemModulePage
      title="QR Code Tracking"
      description="Generate QR codes for assets and scan them to open complete asset details."
      icon="Database"
      actions={[{ label: 'Generate QR', variant: 'primary', icon: 'Plus' }, { label: 'Scan QR', icon: 'Search' }]}
      stats={[
        { label: 'QR Generated', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Database' },
        { label: 'Scans Today', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'Search' },
        { label: 'Missing QR', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'AlertTriangle' },
        { label: 'Asset Pages', value: '—', color: '#06B6D4', bg: '#ECFEFF', icon: 'FileText' },
      ]}
      features={['QR code per asset', 'Scan opens asset details', 'Owner and department view', 'Warranty and service history']}
      workflow={['Asset added', 'Generate QR code', 'Attach label', 'Scan to view details']}
      apiEndpoint="/assets"
      statsEndpoint="qr"
      mapRecord={mapRecord}
    />
  );
}
