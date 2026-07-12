import { SystemModulePage } from './SystemModulePage';

export default function Assignments() {
  return (
    <SystemModulePage
      title="Asset Assignment"
      description="Assign, return, reassign, and track lost or damaged asset workflows."
      icon="Send"
      actions={[{ label: 'Assign Asset', variant: 'primary', icon: 'Send' }, { label: 'Return Asset', icon: 'RotateCcw' }]}
      stats={[
        { label: 'Assigned', value: '847', color: '#4F46E5', bg: '#EEF2FF', icon: 'Package' },
        { label: 'Accepted', value: '821', color: '#10B981', bg: '#ECFDF5', icon: 'CheckCircle' },
        { label: 'Pending', value: '26', color: '#F59E0B', bg: '#FFFBEB', icon: 'Clock' },
        { label: 'Damaged/Lost', value: '9', color: '#EF4444', bg: '#FEF2F2', icon: 'AlertTriangle' },
      ]}
      features={['Assign', 'Return', 'Reassign', 'Lost asset', 'Damaged asset', 'Assignment history']}
      workflow={['New asset', 'Assign employee', 'Accept assignment', 'Asset active']}
      records={[
        { id: 'ASN-001', title: 'MacBook Pro 16" M3', subtitle: 'Assigned to Sarah Chen', meta: ['AST-2847', 'Engineering', 'Accepted today'], status: 'Assigned' },
        { id: 'ASN-002', title: 'Dell Monitor 27"', subtitle: 'Assigned to Mike Johnson', meta: ['AST-1923', 'Design', 'Return overdue'], status: 'Review' },
        { id: 'ASN-003', title: 'iPhone 15 Pro', subtitle: 'Pending employee acceptance', meta: ['AST-6678', 'Sales', 'Assigned yesterday'], status: 'Pending' },
      ]}
    />
  );
}
