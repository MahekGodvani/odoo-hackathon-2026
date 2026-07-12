import { SystemModulePage } from './SystemModulePage';

export default function Transfers() {
  return (
    <SystemModulePage
      title="Asset Transfer"
      description="Request, approve, transfer, confirm, and store department transfer history."
      icon="Truck"
      actions={[{ label: 'New Transfer', variant: 'primary', icon: 'Truck' }, { label: 'Export History', icon: 'Download' }]}
      stats={[
        { label: 'Transfers', value: '42', color: '#4F46E5', bg: '#EEF2FF', icon: 'Truck' },
        { label: 'Pending Approval', value: '8', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
        { label: 'Confirmed', value: '31', color: '#10B981', bg: '#ECFDF5', icon: 'CheckCircle' },
        { label: 'Rejected', value: '3', color: '#EF4444', bg: '#FEF2F2', icon: 'X' },
      ]}
      features={['Transfer request', 'Approval workflow', 'Confirmation', 'Transfer history']}
      workflow={['Request', 'Approval', 'Transfer', 'Confirmation']}
      records={[
        { id: 'TRN-001', title: 'Dell Monitor 27"', subtitle: 'Computer Department to Accounts Department', meta: ['Requested by Mike Johnson', 'Approver: Kavita Rao'], status: 'Pending' },
        { id: 'TRN-002', title: 'Projector Kit #3', subtitle: 'Marketing to Civil', meta: ['Confirmed yesterday', 'Condition checked'], status: 'Completed' },
        { id: 'TRN-003', title: 'Cisco Switch 48P', subtitle: 'IT to Server Room Inventory', meta: ['Approved by Lisa Park', 'Awaiting handover'], status: 'Approved' },
      ]}
    />
  );
}
