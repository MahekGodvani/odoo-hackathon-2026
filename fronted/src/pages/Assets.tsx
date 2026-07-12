// src/pages/Assets.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge, getStatusVariant } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

const Assets: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    assigned: 0,
    maintenance: 0,
  });

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [editForm, setEditForm] = useState({
    name: '',
    model: '',
    serialNumber: '',
    categoryId: '',
    departmentId: '',
    condition: 'Excellent',
    status: 'Available',
    purchaseDate: '',
    warrantyExpiry: '',
    vendorId: '',
    purchaseCost: '',
    description: '',
  });

  const statuses = ['All', 'Available', 'Assigned', 'Maintenance'];

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const queryParams = [];
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (selectedStatus !== 'All') queryParams.push(`status=${selectedStatus}`);

        const url = `/assets?limit=50&${queryParams.join('&')}`;
        const response = await api.get<any>(url);
        const rows = response.assets || [];
        setAssets(rows);

        const availableCount = rows.filter((r: any) => r.status === 'Available').length;
        const assignedCount = rows.filter((r: any) => r.status === 'Assigned' || r.status === 'Allocated').length;
        const maintenanceCount = rows.filter((r: any) => r.status === 'Maintenance' || r.status === 'Under Maintenance').length;

        setStats({
          total: response.total || rows.length,
          available: availableCount,
          assigned: assignedCount,
          maintenance: maintenanceCount,
        });
      } catch (error) {
        console.error('Error loading assets:', error);
        const dummyAssets = [
          { id: 1, name: 'MacBook Pro 16"', serialNumber: 'MBP16-9874', model: 'A2485', status: 'Available', Category: { name: 'IT Equipment' }, Department: { name: 'Engineering' }, condition: 'Excellent', purchaseDate: '2025-01-10T00:00:00.000Z', warrantyExpiry: '2028-01-10T00:00:00.000Z', purchaseCost: 2499, description: 'M1 Max development machine' },
          { id: 2, name: 'Dell UltraSharp 27"', serialNumber: 'DELL27-4321', model: 'U2720Q', status: 'Available', Category: { name: 'IT Equipment' }, Department: { name: 'Engineering' }, condition: 'Good', purchaseDate: '2025-02-15T00:00:00.000Z', warrantyExpiry: '2028-02-15T00:00:00.000Z', purchaseCost: 450, description: '4K desk monitor' },
          { id: 3, name: 'Ergonomic Office Chair', serialNumber: 'CHAIR-009', model: 'Aeron', status: 'Assigned', Category: { name: 'Furniture' }, Department: { name: 'Human Resources' }, condition: 'Excellent', purchaseDate: '2024-11-20T00:00:00.000Z', warrantyExpiry: '2029-11-20T00:00:00.000Z', purchaseCost: 1200, description: 'HR department chair' },
          { id: 4, name: 'Dell Server R740', serialNumber: 'SRV-R740-02', model: 'PowerEdge', status: 'Maintenance', Category: { name: 'IT Equipment' }, Department: { name: 'Engineering' }, condition: 'Fair', purchaseDate: '2023-05-01T00:00:00.000Z', warrantyExpiry: '2026-05-01T00:00:00.000Z', purchaseCost: 8500, description: 'Local server rack unit' }
        ];

        let filtered = dummyAssets;
        if (selectedStatus !== 'All') {
          filtered = dummyAssets.filter(a => a.status === selectedStatus);
        }
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter(a => a.name.toLowerCase().includes(s) || a.serialNumber.toLowerCase().includes(s));
        }

        setAssets(filtered);
        setStats({
          total: dummyAssets.length,
          available: dummyAssets.filter(a => a.status === 'Available').length,
          assigned: dummyAssets.filter(a => a.status === 'Assigned' || a.status === 'Allocated').length,
          maintenance: dummyAssets.filter(a => a.status === 'Maintenance').length
        });
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchAssets();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedStatus, refreshTrigger]);

  const handleDeleteAsset = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this asset from catalog?')) return;
    try {
      await api.delete(`/assets/${id}`);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      console.warn('API delete asset failed, running local delete:', error);
      setAssets(prev => prev.filter(asset => asset.id !== id));
      setStats(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
    }
  };

  const handleStartEdit = async (asset: any) => {
    try {
      const catRes = await api.get<any[]>('/categories');
      setCategories(catRes || []);
      const deptRes = await api.get<any[]>('/departments');
      setDepartments(deptRes || []);
      const vendorRes = await api.get<any[]>('/vendors');
      setVendors(vendorRes || []);

      setEditForm({
        name: asset.name || '',
        model: asset.model || '',
        serialNumber: asset.serialNumber || '',
        categoryId: asset.categoryId ? String(asset.categoryId) : '',
        departmentId: asset.departmentId ? String(asset.departmentId) : '',
        condition: asset.condition || 'Excellent',
        status: asset.status || 'Available',
        purchaseDate: asset.purchaseDate ? asset.purchaseDate.substring(0, 10) : '',
        warrantyExpiry: asset.warrantyExpiry ? asset.warrantyExpiry.substring(0, 10) : '',
        vendorId: asset.vendorId ? String(asset.vendorId) : '',
        purchaseCost: asset.purchaseCost ? String(asset.purchaseCost) : '',
        description: asset.description || '',
      });
      setShowEditModal(asset);
    } catch (e) {
      console.error('Failed to prepare edit details:', e);
    }
  };

  const handleUpdateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const body = {
        name: editForm.name,
        model: editForm.model || null,
        serialNumber: editForm.serialNumber,
        categoryId: editForm.categoryId ? Number(editForm.categoryId) : null,
        departmentId: editForm.departmentId ? Number(editForm.departmentId) : null,
        condition: editForm.condition,
        status: editForm.status,
        purchaseDate: editForm.purchaseDate || null,
        warrantyExpiry: editForm.warrantyExpiry || null,
        vendorId: editForm.vendorId ? Number(editForm.vendorId) : null,
        purchaseCost: parseFloat(editForm.purchaseCost) || 0,
        description: editForm.description || null,
      };

      await api.put(`/assets/${showEditModal.id}`, body);
      setShowEditModal(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (error: any) {
      alert(error.message || 'Failed to update asset');
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
            Assets
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>
            Manage and track all organizational assets
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" icon={<Icons.Download />}>Export</Button>
          <Button variant="primary" icon={<Icons.Plus />} onClick={() => navigate('/assets/register')}>Register Asset</Button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Assets', value: stats.total, color: '#4F46E5', bg: '#EEF2FF' },
          { label: 'Available', value: stats.available, color: '#10B981', bg: '#ECFDF5' },
          { label: 'Assigned', value: stats.assigned, color: '#06B6D4', bg: '#ECFEFF' },
          { label: 'In Maintenance', value: stats.maintenance, color: '#F59E0B', bg: '#FFFBEB' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: theme.radius.lg, padding: '16px 20px', boxShadow: theme.shadow.sm, border: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
              <Icons.Package />
            </div>
            <div>
              <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{s.label}</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <Card padding="16px 20px" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: theme.colors.background, borderRadius: 10, padding: '8px 14px', flex: 1, border: `1px solid ${theme.colors.border}` }}>
            <Icons.Search />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets by name or ID..."
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: theme.colors.text.primary, width: '100%', fontFamily: theme.font }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', fontFamily: theme.font,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s',
                  background: selectedStatus === s ? theme.colors.primary : '#F3F4F6',
                  color: selectedStatus === s ? '#fff' : theme.colors.text.muted,
                }}
              >{s}</button>
            ))}
          </div>
          <Button variant="secondary" icon={<Icons.Filter />}>Filter</Button>
        </div>
      </Card>

      {/* Assets Table */}
      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>
            {loading ? 'Searching assets...' : `${assets.length} assets found`}
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: theme.colors.text.muted, fontWeight: 500 }}>
              Retrieving live assets data from database...
            </div>
          ) : assets.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: theme.colors.text.muted, fontWeight: 500 }}>
              No assets found.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#FAFBFC' }}>
                  {['Asset ID', 'Name', 'Category', 'Department', 'Condition', 'Status', 'Purchase Cost', 'Warranty Expiry', 'Actions'].map(col => (
                    <th key={col} style={{
                      padding: '12px 20px', textAlign: 'left', fontSize: 12, fontWeight: 600,
                      color: theme.colors.text.muted, letterSpacing: '0.04em', textTransform: 'uppercase',
                      borderBottom: `1px solid ${theme.colors.borderLight}`,
                    }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr key={asset.id} style={{ borderBottom: `1px solid ${theme.colors.borderLight}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FAFBFC'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: theme.colors.primary, background: '#EEF2FF', padding: '2px 8px', borderRadius: 6 }}>
                        {asset.serialNumber || `AST-${asset.id}`}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 14, fontWeight: 600, color: theme.colors.text.primary }}>
                      {asset.name}
                      <div style={{ fontSize: 11, fontWeight: 400, color: theme.colors.text.muted, marginTop: 2 }}>{asset.model}</div>
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.muted }}>{asset.Category?.name || 'N/A'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.muted }}>{asset.Department?.name || 'Inventory'}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.secondary }}>{asset.condition}</td>
                    <td style={{ padding: '14px 20px' }}><Badge variant={getStatusVariant(asset.status)}>{asset.status}</Badge></td>
                    <td style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: theme.colors.text.primary }}>
                      ${asset.purchaseCost}
                    </td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: theme.colors.text.muted }}>
                      {asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : 'N/A'}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleStartEdit(asset)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid ${theme.colors.border}`, background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.colors.text.muted }}>
                          <Icons.Edit />
                        </button>
                        <button onClick={() => handleDeleteAsset(asset.id)} style={{ width: 30, height: 30, borderRadius: 8, border: `1px solid #FCA5A5`, background: '#FEF2F2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                          <Icons.Trash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Edit Asset Overlay Modal */}
      {showEditModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.font
        }}>
          <form onSubmit={handleUpdateAsset} style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 540,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '24px 28px', border: `1px solid ${theme.colors.borderLight}`,
            display: 'flex', flexDirection: 'column', gap: 14,
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.text.primary }}>Edit Asset details</h3>
              <button type="button" onClick={() => setShowEditModal(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted, display: 'flex', alignItems: 'center', padding: 4 }}>
                <Icons.X />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Asset Name *</span>
                <input style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} required />
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Model / Subtitle</span>
                <input style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} value={editForm.model} onChange={e => setEditForm({...editForm, model: e.target.value})} />
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Serial Number *</span>
                <input style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} value={editForm.serialNumber} onChange={e => setEditForm({...editForm, serialNumber: e.target.value})} required />
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Category</span>
                <select style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8, background: '#fff' }} value={editForm.categoryId} onChange={e => setEditForm({...editForm, categoryId: e.target.value})}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Department</span>
                <select style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8, background: '#fff' }} value={editForm.departmentId} onChange={e => setEditForm({...editForm, departmentId: e.target.value})}>
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Condition</span>
                <select style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8, background: '#fff' }} value={editForm.condition} onChange={e => setEditForm({...editForm, condition: e.target.value})}>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Status</span>
                <select style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8, background: '#fff' }} value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})}>
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Purchase Cost ($) *</span>
                <input type="number" style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} value={editForm.purchaseCost} onChange={e => setEditForm({...editForm, purchaseCost: e.target.value})} required />
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Purchase Date</span>
                <input type="date" style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} value={editForm.purchaseDate} onChange={e => setEditForm({...editForm, purchaseDate: e.target.value})} />
              </label>
              <label>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Warranty Expiry</span>
                <input type="date" style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8 }} value={editForm.warrantyExpiry} onChange={e => setEditForm({...editForm, warrantyExpiry: e.target.value})} />
              </label>
              <label style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Vendor Partner</span>
                <select style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8, background: '#fff' }} value={editForm.vendorId} onChange={e => setEditForm({...editForm, vendorId: e.target.value})}>
                  <option value="">Select Vendor</option>
                  {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </label>
              <label style={{ gridColumn: 'span 2' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.text.secondary }}>Description Notes</span>
                <textarea style={{ width: '100%', padding: '8px 12px', border: `1px solid ${theme.colors.border}`, borderRadius: 8, resize: 'vertical' }} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} rows={2} />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'flex-end' }}>
              <Button variant="secondary" type="button" onClick={() => setShowEditModal(null)}>Cancel</Button>
              <Button variant="primary" type="submit">Update Asset</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Assets;
