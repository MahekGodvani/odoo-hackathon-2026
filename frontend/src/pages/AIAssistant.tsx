import { SystemModulePage } from './SystemModulePage';

export default function AIAssistant() {
  return (
    <SystemModulePage
      title="AI Assistant"
      description="Small assistant for asset health summary, maintenance prediction, and repair pattern insights."
      icon="Cpu"
      actions={[{ label: 'Run Analysis', variant: 'primary', icon: 'Activity' }, { label: 'Export Insights', icon: 'Download' }]}
      stats={[
        { label: 'Asset Health', value: '92%', color: '#10B981', bg: '#ECFDF5', icon: 'Activity' },
        { label: 'Predictions', value: '18', color: '#4F46E5', bg: '#EEF2FF', icon: 'TrendingUp' },
        { label: 'Patterns', value: '6', color: '#F59E0B', bg: '#FFFBEB', icon: 'Search' },
        { label: 'Alerts', value: '3', color: '#EF4444', bg: '#FEF2F2', icon: 'AlertTriangle' },
      ]}
      features={['Asset health summary', 'Maintenance prediction', 'Repair pattern detection']}
      workflow={['Read asset history', 'Analyze failures', 'Predict maintenance', 'Recommend action']}
      records={[
        { id: 'AI-001', title: 'Dell 5420 Health Summary', subtitle: 'Overall health 92%', meta: ['Battery degrading', 'Warranty expires in 34 days', 'Recommend service'], status: 'Healthy' },
        { id: 'AI-002', title: 'Printer Maintenance Prediction', subtitle: 'Repaired 6 times', meta: ['Likely maintenance within 30 days', 'Technician review recommended'], status: 'Review' },
        { id: 'AI-003', title: 'Computer Lab Repair Pattern', subtitle: '18 of 20 Dell PCs had RAM failure', meta: ['Recommend inspection', 'Bulk part procurement suggested'], status: 'Critical' },
      ]}
    />
  );
}
