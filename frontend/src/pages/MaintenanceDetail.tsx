import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge, getPriorityVariant, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { allAssets, allMaintenanceRequests } from '../data/mockData';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

const detailLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: theme.colors.text.muted,
  marginBottom: 4,
};

const detailValueStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: theme.colors.text.primary,
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  padding: '10px 12px',
  fontSize: 14,
  color: theme.colors.text.primary,
  background: '#fff',
  outline: 'none',
  fontFamily: theme.font,
};

const statusOptions = ['Pending', 'Scheduled', 'In Progress', 'Completed'];

const MaintenanceDetail: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const request = allMaintenanceRequests.find((item) => item.id === requestId);
  const asset = allAssets.find((item) => item.id === request?.assetId);
  const [status, setStatus] = useState(request?.status ?? 'Pending');
  const [adminNote, setAdminNote] = useState('');

  const timeline = useMemo(() => {
    if (!request) {
      return [];
    }

    return [
      { label: 'Request Raised', value: request.date, complete: true },
      { label: 'Assigned to Technician', value: request.assignee, complete: true },
      { label: 'Work In Progress', value: status === 'Pending' ? 'Waiting' : 'Active', complete: status !== 'Pending' },
      { label: 'Request Completed', value: status === 'Completed' ? 'Done' : 'Not completed', complete: status === 'Completed' },
    ];
  }, [request, status]);

  if (!request) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 32 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: 22, color: theme.colors.text.primary }}>Maintenance request not found</h1>
          <p style={{ margin: '0 0 20px', color: theme.colors.text.muted }}>The selected request does not exist in the current maintenance list.</p>
          <Button variant="primary" onClick={() => navigate('/maintenance')}>Back to Maintenance</Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <button
            type="button"
            onClick={() => navigate('/maintenance')}
            style={{
              border: 'none',
              background: 'transparent',
              color: theme.colors.primary,
              fontFamily: theme.font,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              padding: 0,
              marginBottom: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icons.ArrowRight />
            Back to Maintenance
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
              {request.asset}
            </h1>
            <Badge variant={getPriorityVariant(request.priority)}>{request.priority}</Badge>
            <Badge variant={getStatusVariant(status)}>{status}</Badge>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: theme.colors.text.muted }}>
            {request.id} · {request.type} · Asset {request.assetId}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" icon={<Icons.FileText />}>Export</Button>
          <Button variant="primary" icon={<Icons.CheckCircle />} disabled={status === 'Completed'} onClick={() => setStatus('Completed')}>
            Mark Complete
          </Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: '#FFFBEB', color: theme.colors.warning.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Maintenance />
              </div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Request Details</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                ['Request ID', request.id],
                ['Type', request.type],
                ['Raised By', request.raisedBy],
                ['Raised Date', request.date],
                ['Assigned To', request.assignee],
                ['Department', request.dept],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: 14, borderRadius: theme.radius.md, background: '#FAFBFC', border: `1px solid ${theme.colors.borderLight}` }}>
                  <div style={detailLabelStyle}>{label}</div>
                  <div style={detailValueStyle}>{value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Package />
              </div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Asset Details</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                ['Asset Name', request.asset],
                ['Asset ID', request.assetId],
                ['Category', asset?.category ?? 'Unknown'],
                ['Current Owner', asset?.assignee ?? 'Unassigned'],
                ['Location', asset?.location ?? 'Not available'],
                ['Asset Value', asset?.value ?? 'Not available'],
                ['Purchase Date', asset?.purchaseDate ?? 'Not available'],
                ['Warranty Expiry', asset?.warranty ?? 'Not available'],
                ['Current Asset Status', asset?.status ?? 'Maintenance'],
              ].map(([label, value]) => (
                <div key={label} style={{ padding: 14, borderRadius: theme.radius.md, background: '#FAFBFC', border: `1px solid ${theme.colors.borderLight}` }}>
                  <div style={detailLabelStyle}>{label}</div>
                  <div style={detailValueStyle}>{value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Admin Notes</h2>
            <textarea
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              placeholder="Add diagnosis, replacement parts, vendor notes, approval comments, or next steps"
              style={{ ...fieldStyle, minHeight: 120, resize: 'vertical' }}
            />
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Update Status</h2>
            <label>
              <span style={{ display: 'block', fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary, marginBottom: 7 }}>Maintenance Status</span>
              <select style={fieldStyle} value={status} onChange={(event) => setStatus(event.target.value)}>
                {statusOptions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 16 }}>
              <Button variant="secondary" onClick={() => setStatus('Scheduled')}>Schedule</Button>
              <Button variant="primary" onClick={() => setStatus('In Progress')}>Start Work</Button>
            </div>
          </Card>

          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Progress</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {timeline.map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ color: item.complete ? theme.colors.success.main : theme.colors.text.light, paddingTop: 1 }}>
                    {item.complete ? <Icons.CheckCircle /> : <Icons.Clock />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>{item.label}</div>
                    <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Priority Summary</h2>
            <div style={{ borderRadius: theme.radius.md, background: '#FAFBFC', border: `1px solid ${theme.colors.borderLight}`, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: theme.colors.text.muted }}>Priority</span>
                <Badge variant={getPriorityVariant(request.priority)}>{request.priority}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: theme.colors.text.muted }}>Current Status</span>
                <Badge variant={getStatusVariant(status)}>{status}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: theme.colors.text.muted }}>Technician</span>
                <strong style={{ fontSize: 13, color: theme.colors.text.primary }}>{request.assignee}</strong>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDetail;
