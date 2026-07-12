import { SystemModulePage } from './SystemModulePage';

export default function Employees() {
  return (
    <SystemModulePage
      title="Employee Management"
      description="Maintain employee profiles and show assets assigned to each employee."
      icon="Users"
      actions={[{ label: 'Add Employee', variant: 'primary', icon: 'Plus' }, { label: 'Import Excel', icon: 'Download' }]}
      stats={[
        { label: 'Employees', value: '486', color: '#4F46E5', bg: '#EEF2FF', icon: 'Users' },
        { label: 'Assigned Assets', value: '847', color: '#10B981', bg: '#ECFDF5', icon: 'Package' },
        { label: 'Departments', value: '7', color: '#06B6D4', bg: '#ECFEFF', icon: 'Organization' },
        { label: 'Pending Accept', value: '12', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
      ]}
      features={['Employee profile', 'Assigned asset view', 'Department mapping', 'Designation and contact details']}
      workflow={['Create profile', 'Map department', 'Assign assets', 'Employee accepts assignment']}
      records={[
        { id: 'EMP-1001', title: 'Sarah Chen', subtitle: 'Engineering · Senior Developer', meta: ['sarah@assetflow.test', '+1 555 0101', '3 assets'], status: 'Active' },
        { id: 'EMP-1002', title: 'Mike Johnson', subtitle: 'Design · Product Designer', meta: ['mike@assetflow.test', '+1 555 0102', '2 assets'], status: 'Assigned' },
        { id: 'EMP-1003', title: 'Lisa Park', subtitle: 'IT · Network Admin', meta: ['lisa@assetflow.test', '+1 555 0103', '5 assets'], status: 'Active' },
      ]}
    />
  );
}
