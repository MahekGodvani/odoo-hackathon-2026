import { SystemModulePage } from './SystemModulePage';

export default function Departments() {
  return (
    <SystemModulePage
      title="Department Management"
      description="Track departments, heads, employee count, and asset ownership."
      icon="Organization"
      actions={[{ label: 'Add Department', variant: 'primary', icon: 'Plus' }, { label: 'Export', icon: 'Download' }]}
      stats={[
        { label: 'Departments', value: '7', color: '#4F46E5', bg: '#EEF2FF', icon: 'Organization' },
        { label: 'Employees', value: '486', color: '#10B981', bg: '#ECFDF5', icon: 'Users' },
        { label: 'Assets', value: '2,131', color: '#06B6D4', bg: '#ECFEFF', icon: 'Package' },
        { label: 'Transfers', value: '14', color: '#8B5CF6', bg: '#F5F3FF', icon: 'Truck' },
      ]}
      features={['Department head', 'Employee count', 'Asset count', 'Department-wise reports']}
      workflow={['Create department', 'Assign department head', 'Add employees', 'Track assets']}
      records={[
        { id: 'DEP-001', title: 'Computer', subtitle: 'Head: Dr. Meera Sharma', meta: ['128 employees', '642 assets'], status: 'Active' },
        { id: 'DEP-002', title: 'Civil', subtitle: 'Head: Prof. R. Kumar', meta: ['74 employees', '218 assets'], status: 'Active' },
        { id: 'DEP-003', title: 'Accounts', subtitle: 'Head: Kavita Rao', meta: ['28 employees', '96 assets'], status: 'Active' },
      ]}
    />
  );
}
