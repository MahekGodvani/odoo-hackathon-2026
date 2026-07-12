// src/pages/Transfers.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function Transfers() {
  const mapRecord = (transfer: any): ModuleRecord => ({
    id: `TRN-${String(transfer.id).padStart(3, '0')}`,
    title: transfer.Asset?.name || 'Unknown Asset',
    subtitle: `Transfer: ${transfer.FromDepartment?.name || 'Inventory'} ➜ ${transfer.ToDepartment?.name || 'Inventory'}`,
    meta: [
      `Date: ${new Date(transfer.transferDate).toLocaleDateString()}`,
      `Approved By: ${transfer.Approver?.name || 'System'}`,
      `Notes: ${transfer.notes || 'None'}`
    ],
    status: transfer.status || 'Approved'
  });

  return (
    <SystemModulePage
      title="Asset Transfer"
      description="Request, approve, transfer, confirm, and store department transfer history."
      icon="Truck"
      actions={[{ label: 'New Transfer', variant: 'primary', icon: 'Truck' }, { label: 'Export History', icon: 'Download' }]}
      stats={[
        { label: 'Transfers', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Truck' },
        { label: 'Pending Approval', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
        { label: 'Confirmed', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'CheckCircle' },
        { label: 'Rejected', value: '—', color: '#EF4444', bg: '#FEF2F2', icon: 'X' },
      ]}
      features={['Transfer request', 'Approval workflow', 'Confirmation', 'Transfer history']}
      workflow={['Request', 'Approval', 'Transfer', 'Confirmation']}
      apiEndpoint="/transfers"
      statsEndpoint="transfers"
      mapRecord={mapRecord}
    />
  );
}
