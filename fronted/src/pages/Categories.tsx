// src/pages/Categories.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function Categories() {
  const mapRecord = (cat: any): ModuleRecord => ({
    id: cat.code || `CAT-${cat.id}`,
    title: cat.name || 'Unknown Category',
    subtitle: cat.description || 'No description',
    meta: [`ID: ${cat.id}`],
    status: 'Active'
  });

  return (
    <SystemModulePage
      title="Category Management"
      description="Manage asset categories such as IT equipment, furniture, electrical, laboratory, vehicle, medical, and office equipment."
      icon="Tag"
      actions={[{ label: 'Add Category', variant: 'primary', icon: 'Plus' }, { label: 'Export', icon: 'Download' }]}
      stats={[
        { label: 'Categories', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Tag' },
        { label: 'Active Assets', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'Package' },
        { label: 'Top Category', value: 'IT', color: '#06B6D4', bg: '#ECFEFF', icon: 'Cpu' },
        { label: 'Needs Review', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'AlertTriangle' },
      ]}
      features={['Create category', 'Edit category', 'Delete category', 'Map category to assets']}
      workflow={['Create category', 'Assign asset type', 'Map assets', 'Review usage']}
      apiEndpoint="/categories"
      statsEndpoint="categories"
      mapRecord={mapRecord}
    />
  );
}
