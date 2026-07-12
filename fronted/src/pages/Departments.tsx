// src/pages/Departments.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function Departments() {
  const mapRecord = (dept: any): ModuleRecord => ({
    id: dept.code || `DEP-${dept.id}`,
    title: dept.name || 'Unknown Department',
    subtitle: dept.description || 'No description',
    meta: [
      dept.Manager ? `Manager: ${dept.Manager.name}` : 'No Manager Assigned',
      dept.Manager ? `Contact: ${dept.Manager.email}` : ''
    ].filter(Boolean),
    status: 'Active'
  });

  return (
    <SystemModulePage
      title="Department Management"
      description="Track departments, heads, employee count, and asset ownership."
      icon="Organization"
      actions={[{ label: 'Add Department', variant: 'primary', icon: 'Plus' }, { label: 'Export', icon: 'Download' }]}
      stats={[
        { label: 'Departments', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Organization' },
        { label: 'Employees', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'Users' },
        { label: 'Assets', value: '—', color: '#06B6D4', bg: '#ECFEFF', icon: 'Package' },
        { label: 'Transfers', value: '—', color: '#8B5CF6', bg: '#F5F3FF', icon: 'Truck' },
      ]}
      features={['Department head', 'Employee count', 'Asset count', 'Department-wise reports']}
      workflow={['Create department', 'Assign department head', 'Add employees', 'Track assets']}
      apiEndpoint="/departments"
      statsEndpoint="departments"
      mapRecord={mapRecord}
    />
  );
}
