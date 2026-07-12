// src/pages/RegisterAsset.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 700,
  color: theme.colors.text.secondary,
  marginBottom: 7,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 15,
  fontWeight: 700,
  color: theme.colors.text.primary,
};

const RegisterAsset: React.FC = () => {
  const navigate = useNavigate();

  // Database option lists
  const [categories, setCategories] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  // Form states
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [condition, setCondition] = useState('Excellent');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyExpiry, setWarrantyExpiry] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [purchaseCost, setPurchaseCost] = useState('');
  const [description, setDescription] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load lists on mount
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const catRes = await api.get<any[]>('/categories');
        setCategories(catRes || []);
        if (catRes && catRes.length > 0) setCategoryId(String(catRes[0].id));

        const deptRes = await api.get<any[]>('/departments');
        setDepartments(deptRes || []);
        if (deptRes && deptRes.length > 0) setDepartmentId(String(deptRes[0].id));

        const vendorRes = await api.get<any[]>('/vendors');
        setVendors(vendorRes || []);
        if (vendorRes && vendorRes.length > 0) setVendorId(String(vendorRes[0].id));
      } catch (err) {
        console.error('Failed to load asset form metadata lists:', err);
      }
    };
    loadDropdownData();
  }, []);

  const canSubmit = name.trim() && serialNumber.trim() && purchaseCost.trim() && purchaseDate;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMsg('Please fill in all required fields (Name, Serial Number, Purchase Cost, Purchase Date).');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const body = {
        name,
        serialNumber,
        model: model || null,
        description: description || null,
        categoryId: categoryId ? Number(categoryId) : null,
        departmentId: departmentId ? Number(departmentId) : null,
        condition,
        purchaseDate: purchaseDate || null,
        purchaseCost: parseFloat(purchaseCost) || 0,
        vendorId: vendorId ? Number(vendorId) : null,
        warrantyExpiry: warrantyExpiry || null,
      };

      await api.post('/assets', body);
      navigate('/assets');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register new asset.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <button
            type="button"
            onClick={() => navigate('/assets')}
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
            Back to Assets
          </button>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
            Register Asset
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>
            Add a new asset to inventory with ownership, warranty, and location details
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => navigate('/assets')}>Cancel</Button>
          <Button variant="primary" type="submit" icon={<Icons.Plus />} disabled={!canSubmit || submitting}>
            {submitting ? 'Saving...' : 'Save Asset'}
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontWeight: 500 }}>
          {errorMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(300px, 1fr)', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Package />
              </div>
              <h2 style={sectionTitleStyle}>Asset Information</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <label>
                <span style={labelStyle}>Asset Name *</span>
                <input style={fieldStyle} value={name} onChange={(event) => setName(event.target.value)} placeholder='MacBook Pro 16" M3' />
              </label>
              <label>
                <span style={labelStyle}>Model / Subtitle</span>
                <input style={fieldStyle} value={model} onChange={(event) => setModel(event.target.value)} placeholder="M3 Max 36GB/1TB" />
              </label>
              <label>
                <span style={labelStyle}>Category</span>
                <select style={fieldStyle} value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Serial Number *</span>
                <input style={fieldStyle} value={serialNumber} onChange={(event) => setSerialNumber(event.target.value)} placeholder="SN-2026-0001" />
              </label>
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.colors.info.light, color: theme.colors.info.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.Organization />
              </div>
              <h2 style={sectionTitleStyle}>Assignment Details</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <label>
                <span style={labelStyle}>Department Allocation</span>
                <select style={fieldStyle} value={departmentId} onChange={(event) => setDepartmentId(event.target.value)}>
                  {departments.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Condition Status</span>
                <select style={fieldStyle} value={condition} onChange={(event) => setCondition(event.target.value)}>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </label>
            </div>
          </Card>

          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: theme.colors.success.light, color: theme.colors.success.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icons.FileText />
              </div>
              <h2 style={sectionTitleStyle}>Purchase and Warranty</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <label>
                <span style={labelStyle}>Purchase Date *</span>
                <input type="date" style={fieldStyle} value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} />
              </label>
              <label>
                <span style={labelStyle}>Warranty Expiry</span>
                <input type="date" style={fieldStyle} value={warrantyExpiry} onChange={(event) => setWarrantyExpiry(event.target.value)} />
              </label>
              <label>
                <span style={labelStyle}>Vendor Partner</span>
                <select style={fieldStyle} value={vendorId} onChange={(event) => setVendorId(event.target.value)}>
                  {vendors.map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Purchase Cost ($) *</span>
                <input type="number" style={fieldStyle} value={purchaseCost} onChange={(event) => setPurchaseCost(event.target.value)} placeholder="3499" />
              </label>
            </div>

            <label style={{ display: 'block', marginTop: 16 }}>
              <span style={labelStyle}>Description Notes</span>
              <textarea
                style={{ ...fieldStyle, minHeight: 96, resize: 'vertical' }}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add configuration, accessories, procurement notes, or handover details"
              />
            </label>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 16 }}>Registration Checklist</h2>
            {[
              { label: 'Asset name added', done: Boolean(name.trim()) },
              { label: 'Serial number captured', done: Boolean(serialNumber.trim()) },
              { label: 'Purchase date selected', done: Boolean(purchaseDate) },
              { label: 'Asset value recorded', done: Boolean(purchaseCost.trim()) },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: `1px solid ${theme.colors.borderLight}` }}>
                <span style={{ color: item.done ? theme.colors.success.main : theme.colors.text.light }}>
                  {item.done ? <Icons.CheckCircle /> : <Icons.Clock />}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: item.done ? theme.colors.text.primary : theme.colors.text.muted }}>
                  {item.label}
                </span>
              </div>
            ))}
          </Card>

          <Card>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 16 }}>Preview</h2>
            <div style={{ border: `1px solid ${theme.colors.borderLight}`, borderRadius: theme.radius.md, padding: 16, background: '#FAFBFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icons.Package />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>
                    {name || 'New Asset'}
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted }}>
                    {serialNumber || 'SN-XXXX'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: theme.colors.text.muted }}>Condition</span>
                  <strong style={{ color: theme.colors.text.primary }}>{condition}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: theme.colors.text.muted }}>Status</span>
                  <strong style={{ color: theme.colors.text.primary }}>Available</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: theme.colors.text.muted }}>Value</span>
                  <strong style={{ color: theme.colors.text.primary }}>${purchaseCost || '0'}</strong>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </form>
  );
};

export default RegisterAsset;
