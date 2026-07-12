// src/pages/Maintenance.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

const Maintenance: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState('All');

  // Modal form states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [assetId, setAssetId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [frequency, setFrequency] = useState('monthly');
  const [nextDueDate, setNextDueDate] = useState('');
  const [techId, setTechId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Metadata option lists
  const [assets, setAssets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get<any[]>('/maintenance/schedules');
      setSchedules(res || []);
    } catch (e) {
      console.error('Failed to load maintenance schedules:', e);
      const dummySchedules = [
        { id: 1, title: 'Server OS Updates & Backups', description: 'Run full package updates and verify mirror backups', frequency: 'weekly', nextDueDate: '2026-07-15T00:00:00.000Z', Asset: { name: 'Dell Server R740' }, Technician: { name: 'Charlie Lee' } },
        { id: 2, title: 'HVAC Air Filter Replacement', description: 'Replace server room intake filters', frequency: 'monthly', nextDueDate: '2026-08-01T00:00:00.000Z', Asset: { name: 'Server Room Air Conditioner' }, Technician: { name: 'Bob Johnson' } },
        { id: 3, title: 'Medical Device Calibration', description: 'Calibrate patient monitoring devices', frequency: 'quarterly', nextDueDate: '2026-09-10T00:00:00.000Z', Asset: { name: 'Medical Monitor Gen2' }, Technician: { name: 'Alice Smith' } }
      ];
      setSchedules(dummySchedules);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Load options when modal opens
  useEffect(() => {
    if (showModal) {
      api.get<any>('/assets?limit=100')
        .then(res => setAssets(res.assets || []))
        .catch(err => {
          console.error('Failed to load assets:', err);
          setAssets([
            { id: 1, name: 'MacBook Pro 16"' },
            { id: 2, name: 'Dell UltraSharp 27"' },
            { id: 3, name: 'Ergonomic Office Chair' }
          ]);
        });

      api.get<any[]>('/users')
        .then(res => setUsers(res || []))
        .catch(err => {
          console.error('Failed to load technicians:', err);
          setUsers([
            { id: 1, name: 'Alice Smith' },
            { id: 2, name: 'Bob Johnson' },
            { id: 3, name: 'Charlie Lee' }
          ]);
        });
    }
    setErrorMsg('');
  }, [showModal]);

  const handleStartEdit = (req: any) => {
    setEditingItem(req);
    setAssetId(String(req.assetId || ''));
    setTitle(req.title || '');
    setDescription(req.description || '');
    setFrequency(req.frequency || 'monthly');
    setNextDueDate(req.nextDueDate ? req.nextDueDate.substring(0, 10) : '');
    setTechId(req.assignedTechnicianId ? String(req.assignedTechnicianId) : '');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setAssetId('');
    setTitle('');
    setDescription('');
    setFrequency('monthly');
    setNextDueDate('');
    setTechId('');
    setErrorMsg('');
  };

  const handleDeleteSchedule = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel and delete this maintenance task?')) return;
    try {
      await api.delete(`/maintenance/schedules/${id}`);
      fetchSchedules();
    } catch (e: any) {
      console.warn('API delete schedule failed, running local delete:', e);
      setSchedules(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !title || !nextDueDate) {
      setErrorMsg('Asset, Title, and Next Due Date are required.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const body = {
        assetId: Number(assetId),
        title,
        description: description || null,
        frequency,
        nextDueDate,
        assignedTechnicianId: techId ? Number(techId) : null,
      };

      if (editingItem) {
        await api.put(`/maintenance/schedules/${editingItem.id}`, body);
      } else {
        await api.post('/maintenance/schedules', body);
      }
      handleCloseModal();
      fetchSchedules();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete task operation.');
    } finally {
      setSubmitting(false);
    }
  };

  const frequencies = ['All', 'once', 'weekly', 'monthly', 'quarterly', 'yearly'];
  const filtered = schedules.filter(s =>
    selectedFrequency === 'All' || s.frequency === selectedFrequency
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>Maintenance</h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>Track and manage scheduled asset maintenance tasks</p>
        </div>
        <Button variant="primary" icon={<Icons.Plus />} onClick={() => setShowModal(true)}>Raise Request</Button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Tasks', value: schedules.length, color: '#4F46E5', bg: '#EEF2FF', icon: Icons.FileText },
          { label: 'Weekly Schedule', value: schedules.filter(s => s.frequency === 'weekly').length, color: '#EF4444', bg: '#FEF2F2', icon: Icons.AlertTriangle },
          { label: 'Monthly Schedule', value: schedules.filter(s => s.frequency === 'monthly').length, color: '#06B6D4', bg: '#ECFEFF', icon: Icons.Activity },
          { label: 'Yearly Schedule', value: schedules.filter(s => s.frequency === 'yearly').length, color: '#10B981', bg: '#ECFDF5', icon: Icons.CheckCircle },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: theme.radius.lg, padding: '16px 20px', boxShadow: theme.shadow.sm, border: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
              <s.icon />
            </div>
            <div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card padding="14px 20px" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: theme.colors.text.muted, marginRight: 4 }}>Frequency:</span>
          {frequencies.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFrequency(f)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', fontFamily: theme.font,
                fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                background: selectedFrequency === f ? theme.colors.primary : '#F3F4F6',
                color: selectedFrequency === f ? '#fff' : theme.colors.text.muted,
                textTransform: 'capitalize'
              }}
            >{f}</button>
          ))}
        </div>
      </Card>

      {/* Requests List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
            Loading maintenance tasks...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>
            No maintenance records scheduled.
          </div>
        ) : (
          filtered.map((req) => (
            <Card key={req.id} hoverable>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0 }}>
                  <Icons.Maintenance />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>{req.title}</span>
                    <Badge variant="info">{req.frequency}</Badge>
                    <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.primary, background: '#EEF2FF', padding: '2px 8px', borderRadius: 6 }}>MNT-{req.id}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 13, color: theme.colors.text.muted }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Package />{req.Asset?.name || 'Unknown Asset'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.User />{req.Technician?.name || 'Unassigned Tech'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icons.Calendar />Due: {new Date(req.nextDueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Button variant="secondary" size="sm" icon={<Icons.Edit />} onClick={() => handleStartEdit(req)}>Edit</Button>
                  <Button variant="danger" size="sm" icon={<Icons.Trash />} onClick={() => handleDeleteSchedule(req.id)}>Delete</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Raise/Edit Maintenance Request Modal */}
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
                {editingItem ? 'Edit Maintenance Task' : 'Raise Maintenance Request'}
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
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Target Asset *</label>
              <select value={assetId} onChange={e => setAssetId(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                <option value="">Choose Asset</option>
                {assets.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.serialNumber || `AST-${a.id}`})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Task Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Annual calibration check" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Frequency *</label>
              <select value={frequency} onChange={e => setFrequency(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                <option value="once">Once</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Next Due Date *</label>
              <input type="date" value={nextDueDate} onChange={e => setNextDueDate(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Assign Technician</label>
              <select value={techId} onChange={e => setTechId(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                <option value="">Choose Tech</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.Role?.name || 'User'})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Task Details</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Provide specific tasks to perform" rows={2} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
              <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : editingItem ? 'Update Schedule' : 'Raise Request'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
