// src/pages/Vendors.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function Vendors() {
  const mapRecord = (vendor: any): ModuleRecord => ({
    id: `VEN-${String(vendor.id).padStart(3, '0')}`,
    title: vendor.name,
    subtitle: vendor.contactName || 'No contact name provided',
    meta: [
      vendor.email || 'No email address',
      vendor.phone || 'No phone number',
      vendor.address || 'No physical address'
    ],
    status: 'Active'
  });

  return (
    <SystemModulePage
      title="Vendor Management"
      description="Store vendor contact details, product categories, and AMC information."
      icon="Globe"
      actions={[{ label: 'Add Vendor', variant: 'primary', icon: 'Plus' }, { label: 'Export', icon: 'Download' }]}
      stats={[
        { label: 'Vendors', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Globe' },
        { label: 'AMC Active', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'Shield' },
        { label: 'Products', value: '—', color: '#06B6D4', bg: '#ECFEFF', icon: 'Package' },
        { label: 'Renewals', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
      ]}
      features={['Vendor name', 'Address', 'Phone and email', 'Products', 'AMC details']}
      workflow={['Register vendor', 'Map products', 'Add AMC', 'Track renewals']}
      apiEndpoint="/vendors"
      statsEndpoint="vendors"
      mapRecord={mapRecord}
    />
  );
}
