// src/pages/Employees.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function Employees() {
  const mapRecord = (employee: any): ModuleRecord => ({
    id: `EMP-${employee.id}`,
    title: employee.name || 'Unknown Name',
    subtitle: employee.email || 'No email',
    meta: [
      employee.Role?.name || 'Staff Member',
      `Status: ${employee.status || 'Active'}`
    ],
    status: employee.status === 'active' ? 'Active' : 'Suspended'
  });

  return (
    <SystemModulePage
      title="Employee Management"
      description="Maintain employee profiles and show assets assigned to each employee."
      icon="Users"
      actions={[{ label: 'Add Employee', variant: 'primary', icon: 'Plus' }, { label: 'Import Excel', icon: 'Download' }]}
      stats={[
        { label: 'Employees', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Users' },
        { label: 'Assigned Assets', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'Package' },
        { label: 'Departments', value: '—', color: '#06B6D4', bg: '#ECFEFF', icon: 'Organization' },
        { label: 'Pending Accept', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
      ]}
      features={['Employee profile', 'Assigned asset view', 'Department mapping', 'Designation and contact details']}
      workflow={['Create profile', 'Map department', 'Assign assets', 'Employee accepts assignment']}
      apiEndpoint="/users"
      statsEndpoint="employees"
      mapRecord={mapRecord}
    />
  );
}
