// src/pages/Audits.tsx
import React, { useEffect, useState } from 'react';
import { Card } from '../components/ui/Card';
import { Badge, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

const Audits: React.FC = () => {
  const [audits, setAudits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [auditor, setAuditor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchAudits = async () => {
    setLoading(true);
    try {
      const response = await api.get<any[]>('/audits');
      setAudits(response || []);
    } catch (error) {
      console.error('Error fetching audits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const handleStartEdit = (audit: any) => {
    setEditingItem(audit);
    setName(audit.name || audit.title || '');
    setScheduledDate(audit.scheduledDate || audit.startDate || '');
    setAuditor(audit.auditor || '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setName('');
    setScheduledDate('');
    setAuditor('');
    setErrorMsg('');
  };

  const handleDeleteAudit = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel and delete this audit request?')) return;
    try {
      await api.delete(`/audits/${id}`);
      fetchAudits();
    } catch (e: any) {
      alert(e.message || 'Failed to delete audit.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !scheduledDate || !auditor.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const body = {
        name,
        scheduledDate,
        auditor
      };

      if (editingItem) {
        await api.put(`/audits/${editingItem.id}`, body);
      } else {
        await api.post('/audits', body);
      }
      handleCloseModal();
      fetchAudits();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to schedule audit.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Audits</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Schedule and track asset audits</p>
        </div>
        <Button variant="primary" icon={<Icons.Plus />} onClick={() => setShowModal(true)}>Start Audit</Button>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
          Retrieving live audits data from database...
        </div>
      ) : audits.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
          No audits found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {audits.map((audit) => {
            const completedCount = audit.completed || 0;
            const assetsCount = audit.assets || 25;
            const pct = Math.round((completedCount / assetsCount) * 100) || 0;

            return (
              <Card key={audit.id}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
                      <Icons.Audit />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>{audit.name || audit.title}</div>
                      <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 2 }}>
                        {audit.dept || 'IT Department'} · {audit.type || 'Standard Check'}
                      </div>
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(audit.status)}>{audit.status}</Badge>
                </div>
                <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 13, color: theme.colors.text.muted }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.User />{audit.auditor}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icons.Calendar />{audit.scheduledDate || audit.startDate || 'Scheduled'}
                  </span>
                </div>

                {/* Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: theme.colors.text.muted }}>Progress</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.text.primary }}>
                      {completedCount}/{assetsCount} assets
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#F3F4F6', borderRadius: 99 }}>
                    <div style={{ height: '100%', width: `${pct}%`, borderRadius: 99, background: audit.status === 'Overdue' ? '#EF4444' : audit.status === 'Completed' ? '#10B981' : '#4F46E5', transition: 'width 0.5s ease' }}/>
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted, marginTop: 6 }}>{pct}% complete</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="secondary" size="sm" icon={<Icons.Eye />}>View Report</Button>
                    {audit.status !== 'Completed' && <Button variant="primary" size="sm">Continue</Button>}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleStartEdit(audit)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                      <Icons.Edit />
                    </button>
                    <button onClick={() => handleDeleteAudit(audit.id)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid #FCA5A5`, background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                      <Icons.Trash />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Start/Edit Audit Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.font
        }}>
          <form onSubmit={handleSubmit} style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '24px 28px', border: `1px solid ${theme.colors.borderLight}`,
            display: 'flex', flexDirection: 'column', gap: 18
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.text.primary }}>
                {editingItem ? 'Edit Audit Details' : 'Start New Audit'}
              </h3>
              <button type="button" onClick={handleCloseModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted, display: 'flex', alignItems: 'center', padding: 4 }}>
                <Icons.X />
              </button>
            </div>

            {errorMsg && (
              <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Audit Name *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Annual IT Infrastructure Audit" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Auditor Lead *</label>
              <input type="text" value={auditor} onChange={e => setAuditor(e.target.value)} placeholder="e.g. Inspector Cooper" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Scheduled Date *</label>
              <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Scheduling...' : editingItem ? 'Update Audit' : 'Start Audit'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Audits;