import { SystemModulePage } from './SystemModulePage';

export default function Categories() {
  return (
    <SystemModulePage
      title="Category Management"
      description="Manage asset categories such as IT equipment, furniture, electrical, laboratory, vehicle, medical, and office equipment."
      icon="Tag"
      actions={[{ label: 'Add Category', variant: 'primary', icon: 'Plus' }, { label: 'Export', icon: 'Download' }]}
      stats={[
        { label: 'Categories', value: '7', color: '#4F46E5', bg: '#EEF2FF', icon: 'Tag' },
        { label: 'Active Assets', value: '2,131', color: '#10B981', bg: '#ECFDF5', icon: 'Package' },
        { label: 'Top Category', value: 'IT', color: '#06B6D4', bg: '#ECFEFF', icon: 'Cpu' },
        { label: 'Needs Review', value: '2', color: '#F59E0B', bg: '#FFFBEB', icon: 'AlertTriangle' },
      ]}
      features={['Create category', 'Edit category', 'Delete category', 'Map category to assets']}
      workflow={['Create category', 'Assign asset type', 'Map assets', 'Review usage']}
      records={[
        { id: 'CAT-001', title: 'IT Equipment', subtitle: 'Laptops, desktops, monitors, networking devices', meta: ['842 assets', 'Computer Department'], status: 'Active' },
        { id: 'CAT-002', title: 'Furniture', subtitle: 'Desks, chairs, cabinets, lab benches', meta: ['318 assets', 'Operations'], status: 'Active' },
        { id: 'CAT-003', title: 'Vehicle', subtitle: 'Cars, utility vehicles, campus transport', meta: ['18 assets', 'Administration'], status: 'Review' },
      ]}
    />
  );
}
