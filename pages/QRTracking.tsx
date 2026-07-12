import { SystemModulePage } from './SystemModulePage';

export default function QRTracking() {
  return (
    <SystemModulePage
      title="QR Code Tracking"
      description="Generate QR codes for assets and scan them to open complete asset details."
      icon="Database"
      actions={[{ label: 'Generate QR', variant: 'primary', icon: 'Plus' }, { label: 'Scan QR', icon: 'Search' }]}
      stats={[
        { label: 'QR Generated', value: '2,084', color: '#4F46E5', bg: '#EEF2FF', icon: 'Database' },
        { label: 'Scans Today', value: '312', color: '#10B981', bg: '#ECFDF5', icon: 'Search' },
        { label: 'Missing QR', value: '47', color: '#F59E0B', bg: '#FFFBEB', icon: 'AlertTriangle' },
        { label: 'Asset Pages', value: '2,131', color: '#06B6D4', bg: '#ECFEFF', icon: 'FileText' },
      ]}
      features={['QR code per asset', 'Scan opens asset details', 'Owner and department view', 'Warranty and service history']}
      workflow={['Asset added', 'Generate QR code', 'Attach label', 'Scan to view details']}
      records={[
        { id: 'AS000145', title: 'Dell Latitude 5420', subtitle: 'Computer Lab · Owner: Rahul Singh', meta: ['Warranty: 34 days left', 'Condition: Good', 'Location: Lab 2'], status: 'Active' },
        { id: 'AS000146', title: 'HP LaserJet Pro', subtitle: 'Operations · Owner: Tom Richards', meta: ['Service history: 4', 'Location: HQ Floor 1'], status: 'In Progress' },
        { id: 'AS000147', title: 'Cisco Switch 48P', subtitle: 'IT · Server Room', meta: ['Warranty expired', 'Condition: Needs inspection'], status: 'Review' },
      ]}
    />
  );
}
