import { SystemModulePage } from './SystemModulePage';

export default function Vendors() {
  return (
    <SystemModulePage
      title="Vendor Management"
      description="Store vendor contact details, product categories, and AMC information."
      icon="Globe"
      actions={[{ label: 'Add Vendor', variant: 'primary', icon: 'Plus' }, { label: 'Export', icon: 'Download' }]}
      stats={[
        { label: 'Vendors', value: '36', color: '#4F46E5', bg: '#EEF2FF', icon: 'Globe' },
        { label: 'AMC Active', value: '12', color: '#10B981', bg: '#ECFDF5', icon: 'Shield' },
        { label: 'Products', value: '148', color: '#06B6D4', bg: '#ECFEFF', icon: 'Package' },
        { label: 'Renewals', value: '4', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
      ]}
      features={['Vendor name', 'Address', 'Phone and email', 'Products', 'AMC details']}
      workflow={['Register vendor', 'Map products', 'Add AMC', 'Track renewals']}
      records={[
        { id: 'VEN-001', title: 'Dell Technologies', subtitle: 'IT equipment and support', meta: ['support@dell.test', 'AMC: Active', '42 products'], status: 'Active' },
        { id: 'VEN-002', title: 'HP Enterprise', subtitle: 'Printers and servers', meta: ['service@hp.test', 'AMC: Due soon', '28 products'], status: 'Due Soon' },
        { id: 'VEN-003', title: 'Campus Furnish Co.', subtitle: 'Furniture and fixtures', meta: ['ops@furnish.test', 'AMC: None', '18 products'], status: 'Active' },
      ]}
    />
  );
}
