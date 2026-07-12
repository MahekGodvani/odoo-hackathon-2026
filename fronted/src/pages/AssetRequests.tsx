// src/pages/AssetRequests.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';
import type { RootState } from '../store';

const priorityColor: Record<string, { bg: string; color: string }> = {
  Low:      { bg: '#ECFDF5', color: '#10B981' },
  Medium:   { bg: '#FFFBEB', color: '#F59E0B' },
  High:     { bg: '#FEF3C7', color: '#D97706' },
  Critical: { bg: '#FEF2F2', color: '#EF4444' },
};

const statusVariant = (status: string) => {
  if (status === 'Approved') return 'success';
  if (status === 'Rejected') return 'danger';
  if (status === 'Cancelled') return 'default';
  return 'warning';
};

const AssetRequests: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isManager = user?.role === 'Admin' || user?.role === 'Manager';

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);

  // New request modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [reqAssetName, setReqAssetName] = useState('');
  const [reqAssetType, setReqAssetType] = useState('IT Equipment');
  const [reqReason, setReqReason] = useState('');
  const [reqPriority, setReqPriority] = useState('Medium');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Approve modal
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState<any>(null);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [approveError, setApproveError] = useState('');

  // Reject modal
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingRequest, setRejectingRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const endpoint = isManager ? '/asset-requests' : '/asset-requests/mine';
      const data = await api.get<any[]>(endpoint);
      setRequests(data || []);
    } catch (e) {
      console.error('Failed to load asset requests:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleOpenApprove = async (req: any) => {
    setApprovingRequest(req);
    setSelectedAssetId('');
    setApproveError('');
    try {
      const res = await api.get<any>('/assets?status=Available&limit=200');
      setAvailableAssets(res.assets || []);
    } catch { setAvailableAssets([]); }
    setShowApproveModal(true);
  };

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId) { setApproveError('Please select an asset to assign.'); return; }
    setSubmitting(true);
    try {
      await api.put(`/asset-requests/${approvingRequest.id}/approve`, { assetId: Number(selectedAssetId) });
      setShowApproveModal(false);
      fetchRequests();
    } catch (err: any) {
      setApproveError(err.message || 'Failed to approve request.');
    } finally { setSubmitting(false); }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/asset-requests/${rejectingRequest.id}/reject`, { rejectionReason: rejectReason });
      setShowRejectModal(false);
      setRejectReason('');
      fetchRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to reject request.');
    } finally { setSubmitting(false); }
  };

  const handleCancel = async (requestId: number) => {
    if (!window.confirm('Cancel this asset request?')) return;
    try {
      await api.delete(`/asset-requests/${requestId}`);
      fetchRequests();
    } catch (err: any) { alert(err.message || 'Failed to cancel request.'); }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqAssetName.trim() || !reqReason.trim()) {
      setErrorMsg('Asset name and reason are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/asset-requests', {
        requestedAssetName: reqAssetName,
        assetType: reqAssetType,
        reason: reqReason,
        priority: reqPriority,
      });
      setShowNewModal(false);
      setReqAssetName(''); setReqAssetType('IT Equipment'); setReqReason(''); setReqPriority('Medium');
      fetchRequests();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit request.');
    } finally { setSubmitting(false); }
  };

  const pending = requests.filter(r => r.status === 'Pending');
  const approved = requests.filter(r => r.status === 'Approved');
  const rejected = requests.filter(r => r.status === 'Rejected');

  return (
    <div style={{ fontFamily: theme.font }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
            Asset Requests
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>
            {isManager
              ? 'Review and action employee asset requests'
              : 'Request assets you need — your manager will review and assign'}
          </p>
        </div>
        {!isManager && (
          <Button variant="primary" icon={<Icons.Plus />} onClick={() => { setShowNewModal(true); setErrorMsg(''); }}>
            Request an Asset
          </Button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: isManager ? 'Total Requests' : 'My Requests', value: requests.length, color: '#4F46E5', bg: '#EEF2FF', icon: Icons.FileText },
          { label: 'Pending', value: pending.length, color: '#F59E0B', bg: '#FFFBEB', icon: Icons.Clock },
          { label: 'Approved', value: approved.length, color: '#10B981', bg: '#ECFDF5', icon: Icons.CheckCircle },
          { label: 'Rejected', value: rejected.length, color: '#EF4444', bg: '#FEF2F2', icon: Icons.X },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: theme.radius.lg,
            padding: '16px 20px', boxShadow: theme.shadow.sm,
            border: `1px solid ${theme.colors.borderLight}`,
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon />
            </div>
            <div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pending Requests (Manager highlight section) */}
      {isManager && pending.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#D97706', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icons.Clock /> {pending.length} Pending — Action Required
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {pending.map(req => (
              <div key={req.id} style={{
                background: '#FFFBEB', border: '1.5px solid #FDE68A',
                borderRadius: 14, padding: '18px 22px',
                display: 'flex', alignItems: 'center', gap: 18,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icons.Package />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: theme.colors.text.primary }}>{req.requestedAssetName}</span>
                    <span style={{ fontSize: 11, background: priorityColor[req.priority]?.bg, color: priorityColor[req.priority]?.color, fontWeight: 700, padding: '2px 8px', borderRadius: 99 }}>
                      {req.priority}
                    </span>
                    <span style={{ fontSize: 11, color: theme.colors.text.light }}>{req.assetType}</span>
                  </div>
                  <div style={{ fontSize: 13, color: theme.colors.text.secondary, marginBottom: 4 }}>
                    <strong>Reason:</strong> {req.reason}
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted }}>
                    Requested by <strong>{req.Requester?.name || 'Employee'}</strong> · {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <Button variant="primary" size="sm" icon={<Icons.CheckCircle />} onClick={() => handleOpenApprove(req)}>
                    Approve
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Icons.X />} onClick={() => { setRejectingRequest(req); setRejectReason(''); setShowRejectModal(true); }}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Requests Table */}
      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>
            {loading ? 'Loading...' : isManager ? `All Requests (${requests.length})` : `My Requests (${requests.length})`}
          </span>
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: theme.colors.text.muted }}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: theme.colors.text.primary }}>No requests yet</div>
            <div style={{ fontSize: 13, color: theme.colors.text.muted, marginTop: 4 }}>
              {isManager ? 'No asset requests have been raised.' : 'Click "Request an Asset" to raise your first request.'}
            </div>
          </div>
        ) : (
          requests.map((req, i) => (
            <div key={req.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
              borderBottom: i < requests.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
            }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: '#F3F4F6', color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icons.Package />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>{req.requestedAssetName}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4F46E5', background: '#EEF2FF', padding: '2px 8px', borderRadius: 99 }}>REQ-{req.id}</span>
                  <Badge variant={statusVariant(req.status)}>{req.status}</Badge>
                  <span style={{ fontSize: 11, background: priorityColor[req.priority]?.bg, color: priorityColor[req.priority]?.color, fontWeight: 600, padding: '2px 8px', borderRadius: 99 }}>
                    {req.priority}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: theme.colors.text.secondary, marginBottom: 2 }}>
                  {req.assetType} · <span style={{ fontStyle: 'italic' }}>{req.reason}</span>
                </div>
                <div style={{ fontSize: 11, color: theme.colors.text.light, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {isManager && <span>By: <strong>{req.Requester?.name}</strong></span>}
                  <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                  {req.status === 'Approved' && req.ApprovedAsset && (
                    <span style={{ color: '#10B981', fontWeight: 600 }}>✓ Assigned: {req.ApprovedAsset.name}</span>
                  )}
                  {req.status === 'Rejected' && req.rejectionReason && (
                    <span style={{ color: '#EF4444' }}>Reason: {req.rejectionReason}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {isManager && req.status === 'Pending' && (
                  <>
                    <Button variant="primary" size="sm" icon={<Icons.CheckCircle />} onClick={() => handleOpenApprove(req)}>Approve</Button>
                    <Button variant="secondary" size="sm" icon={<Icons.X />} onClick={() => { setRejectingRequest(req); setRejectReason(''); setShowRejectModal(true); }}>Reject</Button>
                  </>
                )}
                {!isManager && req.status === 'Pending' && (
                  <Button variant="secondary" size="sm" icon={<Icons.Trash />} onClick={() => handleCancel(req.id)}>Cancel</Button>
                )}
              </div>
            </div>
          ))
        )}
      </Card>

      {/* New Request Modal */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleSubmitRequest} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 480, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: theme.colors.text.primary }}>Request an Asset</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.colors.text.muted }}>Your manager will review and assign</p>
              </div>
              <button type="button" onClick={() => setShowNewModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted, padding: 4 }}><Icons.X /></button>
            </div>

            {errorMsg && (
              <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            {[
              { label: 'Asset Name / Description *', el: <input type="text" value={reqAssetName} onChange={e => setReqAssetName(e.target.value)} placeholder="e.g. MacBook Pro 14-inch, Ergonomic Chair" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', width: '100%', boxSizing: 'border-box' as any }} /> },
              { label: 'Asset Type', el: (
                <select value={reqAssetType} onChange={e => setReqAssetType(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff', width: '100%', boxSizing: 'border-box' as any }}>
                  {['IT Equipment','Furniture','Vehicle','Laboratory','Medical','Office Supplies','Electrical','Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              )},
              { label: 'Priority', el: (
                <select value={reqPriority} onChange={e => setReqPriority(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff', width: '100%', boxSizing: 'border-box' as any }}>
                  {['Low','Medium','High','Critical'].map(p => <option key={p}>{p}</option>)}
                </select>
              )},
              { label: 'Reason / Business Justification *', el: <textarea value={reqReason} onChange={e => setReqReason(e.target.value)} rows={3} placeholder="Why do you need this asset? How will you use it?" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical', width: '100%', boxSizing: 'border-box' as any }} /> },
            ].map(({ label, el }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>{label}</label>
                {el}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
              <Button variant="secondary" type="button" onClick={() => setShowNewModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Request'}</Button>
            </div>
          </form>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && approvingRequest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleApprove} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 480, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: theme.colors.text.primary }}>Approve Request</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: theme.colors.text.muted }}>Select an available asset to assign</p>
              </div>
              <button type="button" onClick={() => setShowApproveModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted, padding: 4 }}><Icons.X /></button>
            </div>

            <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#166534' }}>Request: {approvingRequest.requestedAssetName}</div>
              <div style={{ fontSize: 12, color: '#15803D', marginTop: 2 }}>By {approvingRequest.Requester?.name} · {approvingRequest.reason}</div>
            </div>

            {approveError && (
              <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px' }}>{approveError}</div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Available Asset to Assign *</label>
              <select value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                <option value="">— Choose an asset —</option>
                {availableAssets.map((a: any) => (
                  <option key={a.id} value={a.id}>{a.name} ({a.serialNumber || 'No serial'}) · {a.Category?.name || 'Uncategorized'}</option>
                ))}
              </select>
              {availableAssets.length === 0 && (
                <div style={{ fontSize: 12, color: '#F59E0B', fontStyle: 'italic' }}>No available assets found. Add assets to the system first.</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
              <Button variant="secondary" type="button" onClick={() => setShowApproveModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={submitting || !selectedAssetId}>{submitting ? 'Approving...' : 'Approve & Assign'}</Button>
            </div>
          </form>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && rejectingRequest && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleReject} style={{ background: '#fff', borderRadius: 18, width: '100%', maxWidth: 440, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: theme.colors.text.primary }}>Reject Request</h3>
              <button type="button" onClick={() => setShowRejectModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted, padding: 4 }}><Icons.X /></button>
            </div>

            <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#881337' }}>{rejectingRequest.requestedAssetName}</div>
              <div style={{ fontSize: 12, color: '#9F1239', marginTop: 2 }}>By {rejectingRequest.Requester?.name}</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Rejection Reason (optional)</label>
              <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="Explain why this request is being rejected..." style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 }}>
              <Button variant="secondary" type="button" onClick={() => setShowRejectModal(false)}>Cancel</Button>
              <Button variant="danger" type="submit" disabled={submitting}>{submitting ? 'Rejecting...' : 'Reject Request'}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssetRequests;
