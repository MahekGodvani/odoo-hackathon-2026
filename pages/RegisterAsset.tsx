import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../icons';
import { theme } from '../styles/theme';

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

const categories = ['Laptop', 'Monitor', 'Tablet', 'Mobile', 'Printer', 'Network', 'Peripheral', 'Furniture', 'Vehicle'];
const departments = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'IT', 'HR', 'Management'];
const statuses = ['Available', 'Allocated', 'Maintenance'];
const locations = ['HQ Floor 1', 'HQ Floor 2', 'HQ Floor 3', 'HQ Floor 4', 'HQ Floor 5', 'Server Room', 'Remote', 'Warehouse'];

const RegisterAsset: React.FC = () => {
  const navigate = useNavigate();
  const [assetName, setAssetName] = useState('');
  const [assetId, setAssetId] = useState('');
  const [category, setCategory] = useState('Laptop');
  const [department, setDepartment] = useState('Engineering');
  const [status, setStatus] = useState('Available');
  const [assignee, setAssignee] = useState('');
  const [location, setLocation] = useState('HQ Floor 3');
  const [serialNumber, setSerialNumber] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [warrantyDate, setWarrantyDate] = useState('');
  const [vendor, setVendor] = useState('');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  const canSubmit = assetName.trim() && assetId.trim() && serialNumber.trim() && purchaseDate && value.trim();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    navigate('/assets');
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
          <Button variant="primary" icon={<Icons.Plus />} disabled={!canSubmit}>Save Asset</Button>
        </div>
      </div>

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
                <span style={labelStyle}>Asset Name</span>
                <input style={fieldStyle} value={assetName} onChange={(event) => setAssetName(event.target.value)} placeholder='MacBook Pro 16" M3' />
              </label>
              <label>
                <span style={labelStyle}>Asset ID</span>
                <input style={fieldStyle} value={assetId} onChange={(event) => setAssetId(event.target.value)} placeholder="AST-9001" />
              </label>
              <label>
                <span style={labelStyle}>Category</span>
                <select style={fieldStyle} value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Serial Number</span>
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
                <span style={labelStyle}>Department</span>
                <select style={fieldStyle} value={department} onChange={(event) => setDepartment(event.target.value)}>
                  {departments.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Status</span>
                <select style={fieldStyle} value={status} onChange={(event) => setStatus(event.target.value)}>
                  {statuses.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>
                <span style={labelStyle}>Assignee</span>
                <input style={fieldStyle} value={assignee} onChange={(event) => setAssignee(event.target.value)} placeholder="Leave blank if unassigned" />
              </label>
              <label>
                <span style={labelStyle}>Location</span>
                <select style={fieldStyle} value={location} onChange={(event) => setLocation(event.target.value)}>
                  {locations.map((item) => <option key={item}>{item}</option>)}
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
                <span style={labelStyle}>Purchase Date</span>
                <input type="date" style={fieldStyle} value={purchaseDate} onChange={(event) => setPurchaseDate(event.target.value)} />
              </label>
              <label>
                <span style={labelStyle}>Warranty Expiry</span>
                <input type="date" style={fieldStyle} value={warrantyDate} onChange={(event) => setWarrantyDate(event.target.value)} />
              </label>
              <label>
                <span style={labelStyle}>Vendor</span>
                <input style={fieldStyle} value={vendor} onChange={(event) => setVendor(event.target.value)} placeholder="Apple Store, Dell, CDW..." />
              </label>
              <label>
                <span style={labelStyle}>Asset Value</span>
                <input style={fieldStyle} value={value} onChange={(event) => setValue(event.target.value)} placeholder="$3,499" />
              </label>
            </div>

            <label style={{ display: 'block', marginTop: 16 }}>
              <span style={labelStyle}>Notes</span>
              <textarea
                style={{ ...fieldStyle, minHeight: 96, resize: 'vertical' }}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Add configuration, accessories, procurement notes, or handover details"
              />
            </label>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card>
            <h2 style={{ ...sectionTitleStyle, marginBottom: 16 }}>Registration Checklist</h2>
            {[
              { label: 'Asset name added', done: Boolean(assetName.trim()) },
              { label: 'Asset ID assigned', done: Boolean(assetId.trim()) },
              { label: 'Serial number captured', done: Boolean(serialNumber.trim()) },
              { label: 'Purchase date selected', done: Boolean(purchaseDate) },
              { label: 'Asset value recorded', done: Boolean(value.trim()) },
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
                    {assetName || 'New Asset'}
                  </div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted }}>
                    {assetId || 'AST-XXXX'} · {category}
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: theme.colors.text.muted }}>Department</span>
                  <strong style={{ color: theme.colors.text.primary }}>{department}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: theme.colors.text.muted }}>Location</span>
                  <strong style={{ color: theme.colors.text.primary }}>{location}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: theme.colors.text.muted }}>Status</span>
                  <strong style={{ color: theme.colors.text.primary }}>{status}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <span style={{ color: theme.colors.text.muted }}>Value</span>
                  <strong style={{ color: theme.colors.text.primary }}>{value || '$0'}</strong>
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
