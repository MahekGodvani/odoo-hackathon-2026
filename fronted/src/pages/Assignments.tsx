// src/pages/Assignments.tsx
import { SystemModulePage } from './SystemModulePage';
import type { ModuleRecord } from './SystemModulePage';

export default function Assignments() {
  const mapRecord = (assignment: any): ModuleRecord => ({
    id: `ASN-${String(assignment.id).padStart(3, '0')}`,
    title: assignment.Asset?.name || 'Unknown Asset',
    subtitle: `Assigned to ${assignment.Employee?.name || 'Unknown Employee'}`,
    meta: [
      `Serial: ${assignment.Asset?.serialNumber || 'N/A'}`,
      `Model: ${assignment.Asset?.model || 'N/A'}`,
      `Notes: ${assignment.notes || 'None'}`
    ],
    status: assignment.status || 'Assigned'
  });

  return (
    <SystemModulePage
      title="Asset Assignment"
      description="Assign, return, reassign, and track lost or damaged asset workflows."
      icon="Send"
      actions={[{ label: 'Assign Asset', variant: 'primary', icon: 'Send' }, { label: 'Return Asset', icon: 'RotateCcw' }]}
      stats={[
        { label: 'Assigned', value: '—', color: '#4F46E5', bg: '#EEF2FF', icon: 'Package' },
        { label: 'Accepted', value: '—', color: '#10B981', bg: '#ECFDF5', icon: 'CheckCircle' },
        { label: 'Pending', value: '—', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
        { label: 'Damaged/Lost', value: '—', color: '#EF4444', bg: '#FEF2F2', icon: 'AlertTriangle' },
      ]}
      features={['Assign', 'Return', 'Reassign', 'Lost asset', 'Damaged asset', 'Assignment history']}
      workflow={['New asset', 'Assign employee', 'Accept assignment', 'Asset active']}
      apiEndpoint="/assignments"
      statsEndpoint="assignments"
      mapRecord={mapRecord}
    />
  );
}
