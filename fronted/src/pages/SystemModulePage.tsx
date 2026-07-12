import React, { useEffect, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Icons } from '../icons';
import { theme } from '../styles/theme';
import { api } from '../utils/api';

type IconKey = keyof typeof Icons;

interface ModuleAction {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: IconKey;
  onClick?: () => void;
}

interface ModuleStat {
  label: string;
  value: string;
  color: string;
  bg: string;
  icon: IconKey;
}

export interface ModuleRecord {
  id: string;
  title: string;
  subtitle: string;
  meta: string[];
  status?: string;
}

interface SystemModulePageProps {
  title: string;
  description: string;
  icon: IconKey;
  actions: ModuleAction[];
  stats: ModuleStat[];
  workflow?: string[];
  features: string[];
  records?: ModuleRecord[];
  apiEndpoint?: string;
  statsEndpoint?: string;
  mapRecord?: (item: any) => ModuleRecord;
}

const statusVariant = (status: string) => {
  const value = status.toLowerCase();

  if (['active', 'completed', 'approved', 'available', 'healthy'].includes(value)) {
    return 'success';
  }

  if (['pending', 'scheduled', 'due soon', 'review'].includes(value)) {
    return 'warning';
  }

  if (['expired', 'lost', 'critical', 'failed', 'incomplete'].includes(value)) {
    return 'error';
  }

  if (['assigned', 'in progress', 'transferred', 'open'].includes(value)) {
    return 'info';
  }

  return 'default';
};

const dummyAssets = [
  { id: 1, name: 'MacBook Pro 16"', serialNumber: 'MBP16-9874', model: 'A2485', status: 'Available' },
  { id: 2, name: 'Dell UltraSharp 27"', serialNumber: 'DELL27-4321', model: 'U2720Q', status: 'Available' },
  { id: 3, name: 'Ergonomic Office Chair', serialNumber: 'CHAIR-009', model: 'Aeron', status: 'Available' },
  { id: 4, name: 'Dell Server R740', serialNumber: 'SRV-R740-02', model: 'PowerEdge', status: 'Available' },
  { id: 5, name: 'iPad Pro 12.9"', serialNumber: 'IPAD-011', model: 'M1 Pro', status: 'Available' },
  { id: 6, name: 'Laboratory Oscilloscope', serialNumber: 'OSC-773', model: 'Keysight', status: 'Available' }
];

const dummyDataByEndpoint: Record<string, any[]> = {
  '/categories': [
    { id: 1, code: 'CAT-001', name: 'IT Equipment', description: 'Computers, laptops, monitors, servers' },
    { id: 2, code: 'CAT-002', name: 'Furniture', description: 'Desks, chairs, filing cabinets' },
    { id: 3, code: 'CAT-003', name: 'Laboratory Devices', description: 'Scientific instruments and test setups' },
    { id: 4, code: 'CAT-004', name: 'Vehicles', description: 'Company cars, delivery vans' },
    { id: 5, code: 'CAT-005', name: 'Medical Gear', description: 'Diagnostic tools, patient monitoring devices' }
  ],
  '/departments': [
    { id: 1, code: 'DEP-ENG', name: 'Engineering', description: 'Software and hardware engineering', Manager: { name: 'Alice Smith', email: 'alice@example.com' } },
    { id: 2, code: 'DEP-HR', name: 'Human Resources', description: 'People operations and talent acquisition', Manager: { name: 'Bob Johnson', email: 'bob@example.com' } },
    { id: 3, code: 'DEP-FIN', name: 'Finance', description: 'Accounts, budgets, tax, and auditing', Manager: { name: 'Charlie Lee', email: 'charlie@example.com' } },
    { id: 4, code: 'DEP-MKT', name: 'Marketing', description: 'Growth, design, advertising, and branding', Manager: { name: 'Diane Prince', email: 'diane@example.com' } }
  ],
  '/users': [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', Role: { name: 'Administrator' }, status: 'active', roleId: 1 },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', Role: { name: 'Manager' }, status: 'active', roleId: 2 },
    { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', Role: { name: 'Technician' }, status: 'active', roleId: 3 },
    { id: 4, name: 'Dave Miller', email: 'dave@example.com', Role: { name: 'Staff Member' }, status: 'active', roleId: 4 },
    { id: 5, name: 'Emma Watson', email: 'emma@example.com', Role: { name: 'Staff Member' }, status: 'suspended', roleId: 4 }
  ],
  '/assignments': [
    { id: 1, Asset: { name: 'MacBook Pro 16"', serialNumber: 'MBP16-9874', model: 'A2485' }, Employee: { name: 'Alice Smith' }, notes: 'For development use', status: 'Assigned' },
    { id: 2, Asset: { name: 'Dell UltraSharp 27"', serialNumber: 'DELL27-4321', model: 'U2720Q' }, Employee: { name: 'Bob Johnson' }, notes: 'Desk setup', status: 'Assigned' },
    { id: 3, Asset: { name: 'Ergonomic Office Chair', serialNumber: 'CHAIR-009', model: 'Aeron' }, Employee: { name: 'Charlie Lee' }, notes: 'Office seat', status: 'Accepted' }
  ],
  '/repairs': [
    { id: 1, Asset: { name: 'MacBook Pro 16"' }, description: 'Screen flickering issue', Requester: { name: 'Alice Smith' }, priority: 'High', requestDate: '2026-07-01T12:00:00Z', status: 'Pending' },
    { id: 2, Asset: { name: 'Dell UltraSharp 27"' }, description: 'USB-C port not charging', Requester: { name: 'Bob Johnson' }, priority: 'Medium', requestDate: '2026-07-05T09:00:00Z', status: 'Assigned' },
    { id: 3, Asset: { name: 'Laboratory Oscilloscope' }, description: 'Calibration out of tolerance', Requester: { name: 'Dr. Bruce Banner' }, priority: 'Critical', requestDate: '2026-07-10T14:30:00Z', status: 'Completed' }
  ],
  '/transfers': [
    { id: 1, Asset: { name: 'Dell Server R740' }, FromDepartment: { name: 'QA Department' }, ToDepartment: { name: 'Production IT' }, transferDate: '2026-06-15T08:00:00Z', Approver: { name: 'Alice Smith' }, notes: 'Relocating target server', status: 'Approved' },
    { id: 2, Asset: { name: 'iPad Pro 12.9"' }, FromDepartment: { name: 'Marketing' }, ToDepartment: { name: 'Sales' }, transferDate: '2026-07-08T10:00:00Z', Approver: { name: 'Bob Johnson' }, notes: 'Client demo usage', status: 'Pending' }
  ],
  '/vendors': [
    { id: 1, name: 'TechSupply Inc.', contactName: 'John Doe', email: 'sales@techsupply.com', phone: '+1-555-0199', address: '123 Tech Way, Silicon Valley, CA' },
    { id: 2, name: 'Global Furniture Corp', contactName: 'Jane Watson', email: 'jane@globalfurniture.com', phone: '+1-555-0144', address: '456 Comfort Blvd, Grand Rapids, MI' },
    { id: 3, name: 'Precision Labs', contactName: 'Sarah Connor', email: 'sarah@precisionlabs.com', phone: '+1-555-0165', address: '789 Science St, Boston, MA' }
  ],
  '/maintenance/records': [
    { id: 1, assetId: 1, Asset: { name: 'MacBook Pro 16"' }, performedBy: 3, description: 'Battery replacement and clean upgrade', cost: 199.00, performedDate: '2026-06-01T00:00:00.000Z', status: 'Completed', notes: 'Replaced with original Apple battery.' },
    { id: 2, assetId: 2, Asset: { name: 'Dell UltraSharp 27"' }, performedBy: 3, description: 'Replacement of broken HDMI board', cost: 75.00, performedDate: '2026-06-15T00:00:00.000Z', status: 'Completed', notes: 'Calibrated screen colors after repair.' },
    { id: 3, assetId: 4, Asset: { name: 'Dell Server R740' }, performedBy: 1, description: 'Power supply replacement', cost: 450.00, performedDate: '2026-07-02T00:00:00.000Z', status: 'Completed', notes: 'Redundant PSU unit replaced.' }
  ],
  '/assets': [
    { id: 1, name: 'MacBook Pro 16"', serialNumber: 'MBP16-9874', model: 'A2485', status: 'Available', purchaseDate: '2025-01-10T00:00:00.000Z', warrantyExpiry: '2028-01-10T00:00:00.000Z', vendorId: 1, Vendor: { name: 'TechSupply Inc.' } },
    { id: 2, name: 'Dell UltraSharp 27"', serialNumber: 'DELL27-4321', model: 'U2720Q', status: 'Available', purchaseDate: '2025-02-15T00:00:00.000Z', warrantyExpiry: '2026-02-15T00:00:00.000Z', vendorId: 1, Vendor: { name: 'TechSupply Inc.' } },
    { id: 3, name: 'Ergonomic Office Chair', serialNumber: 'CHAIR-009', model: 'Aeron', status: 'Assigned', purchaseDate: '2026-06-20T00:00:00.000Z', warrantyExpiry: '2026-08-20T00:00:00.000Z', vendorId: 2, Vendor: { name: 'Global Furniture Corp' } },
    { id: 4, name: 'Dell Server R740', serialNumber: 'SRV-R740-02', model: 'PowerEdge', status: 'Maintenance', purchaseDate: '2023-05-01T00:00:00.000Z', warrantyExpiry: '2025-05-01T00:00:00.000Z', vendorId: 1, Vendor: { name: 'TechSupply Inc.' } }
  ]
};

export const SystemModulePage: React.FC<SystemModulePageProps> = ({
  title,
  description,
  icon,
  actions,
  stats,
  workflow,
  features,
  records = [],
  apiEndpoint,
  statsEndpoint,
  mapRecord,
}) => {
  const HeaderIcon = Icons[icon];
  const [dynamicRecords, setDynamicRecords] = useState<ModuleRecord[]>(records);
  const [loading, setLoading] = useState(!!apiEndpoint);
  const [liveStats, setLiveStats] = useState<ModuleStat[]>(stats);

  // Fetch live stats from backend when statsEndpoint is provided
  useEffect(() => {
    if (!statsEndpoint) return;
    api.get<{ stats: { key: string; label: string; value: string }[] }>(`/reports/module-stats?module=${statsEndpoint}`)
      .then(res => {
        if (res && res.stats && res.stats.length > 0) {
          // Overlay live values onto the existing stat card configs (preserves color/icon/bg)
          const updated = stats.map((s, i) => {
            const live = res.stats[i];
            return live ? { ...s, value: live.value, label: live.label } : s;
          });
          setLiveStats(updated);
        }
      })
      .catch(() => {
        // silently fall back to static stats
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsEndpoint]);

  // Modal display states
  const [showModal, setShowModal] = useState<'category' | 'department' | 'employee' | 'assignment' | 'repair' | 'transfer' | 'vendor' | 'service' | 'warranty' | 'qrcode' | 'return_asset' | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [rawItems, setRawItems] = useState<any[]>([]);

  // Form states
  const [catForm, setCatForm] = useState({ name: '', code: '', description: '' });
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '', managerId: '' });
  const [empForm, setEmpForm] = useState({ name: '', email: '', password: 'Password123', roleId: '4' });
  const [assignForm, setAssignForm] = useState({ assetId: '', employeeId: '', notes: '' });
  const [repairForm, setRepairForm] = useState({ assetId: '', description: '', priority: 'Medium' });
  const [transferForm, setTransferForm] = useState({ assetId: '', toDepartmentId: '', notes: '' });
  const [vendorForm, setVendorForm] = useState({ name: '', contactName: '', email: '', phone: '', address: '' });
  const [serviceForm, setServiceForm] = useState({
    assetId: '',
    performedBy: '',
    performedDate: new Date().toISOString().substring(0, 10),
    description: '',
    cost: '',
    status: 'Completed',
    notes: ''
  });
  const [warrantyForm, setWarrantyForm] = useState({
    purchaseDate: '',
    warrantyExpiry: '',
    vendorId: ''
  });
  const [qrText, setQrText] = useState('');
  const [selectedQrAssetId, setSelectedQrAssetId] = useState('');
  const [generatedQrCodeUrl, setGeneratedQrCodeUrl] = useState('');
  const [qrType, setQrType] = useState<'asset' | 'custom'>('asset');
  
  const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
  const [allAssignments, setAllAssignments] = useState<any[]>([]);

  // Dropdown option states
  const [users, setUsers] = useState<any[]>([]);
  const [availableAssets, setAvailableAssets] = useState<any[]>([]);
  const [allAssets, setAllAssets] = useState<any[]>([]);
  const [allDepts, setAllDepts] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  const loadData = async () => {
    if (!apiEndpoint) {
      setDynamicRecords(records);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<any>(apiEndpoint);
      const raw = Array.isArray(data) ? data : data.assets || [];
      setRawItems(raw);

      if (mapRecord) {
        setDynamicRecords(raw.map(mapRecord));
      } else {
        setDynamicRecords(raw.map((item: any) => ({
          id: item.code || item.serialNumber || String(item.id),
          title: item.name || item.title || 'Unknown Record',
          subtitle: item.description || item.email || 'No description available',
          meta: [item.status || 'Active'],
          status: item.status || 'Active'
        })));
      }
    } catch (error) {
      console.error(`Failed to fetch from ${apiEndpoint}:`, error);
      // Fallback to dummy data
      const fallback = dummyDataByEndpoint[apiEndpoint] || [];
      setRawItems(fallback);
      if (mapRecord) {
        setDynamicRecords(fallback.map(mapRecord));
      } else {
        setDynamicRecords(fallback.map((item: any) => ({
          id: item.code || item.serialNumber || String(item.id),
          title: item.name || item.title || 'Unknown Record',
          subtitle: item.description || item.email || 'No description available',
          meta: [item.status || 'Active'],
          status: item.status || 'Active'
        })));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiEndpoint]);

  // Load dropdown selectors
  useEffect(() => {
    if (showModal === 'department' || showModal === 'employee' || showModal === 'assignment' || showModal === 'service') {
      api.get<any[]>('/users')
        .then(res => setUsers(res || []))
        .catch(err => {
          console.error('Failed to load users list:', err);
          setUsers(dummyDataByEndpoint['/users'] || []);
        });
    }

    if (showModal === 'assignment') {
      api.get<any>('/assets?status=Available')
        .then(res => setAvailableAssets(res.assets || []))
        .catch(err => {
          console.error('Failed to load available assets:', err);
          setAvailableAssets(dummyAssets);
        });
    }

    if (showModal === 'repair') {
      api.get<any>('/assets?limit=100')
        .then(res => setAllAssets(res.assets || []))
        .catch(err => {
          console.error('Failed to load assets list for repair:', err);
          setAllAssets(dummyAssets);
        });
    }

    if (showModal === 'service') {
      api.get<any>('/assets?limit=100')
        .then(res => setAllAssets(res.assets || []))
        .catch(err => {
          console.error('Failed to load assets list for service:', err);
          setAllAssets(dummyAssets);
        });
    }

    if (showModal === 'transfer') {
      api.get<any>('/assets?limit=100')
        .then(res => setAllAssets(res.assets || []))
        .catch(err => {
          console.error('Failed to load assets:', err);
          setAllAssets(dummyAssets);
        });

      api.get<any[]>('/departments')
        .then(res => setAllDepts(res || []))
        .catch(err => {
          console.error('Failed to load departments:', err);
          setAllDepts(dummyDataByEndpoint['/departments'] || []);
        });
    }

    if (showModal === 'warranty') {
      api.get<any[]>('/vendors')
        .then(res => setVendors(res || []))
        .catch(err => {
          console.error('Failed to load vendors list:', err);
          setVendors(dummyDataByEndpoint['/vendors'] || []);
        });
    }

    if (showModal === 'qrcode') {
      api.get<any>('/assets?limit=100')
        .then(res => setAllAssets(res.assets || []))
        .catch(err => {
          console.error('Failed to load assets list for QR code:', err);
          setAllAssets(dummyAssets);
        });
      setGeneratedQrCodeUrl('');
      setSelectedQrAssetId('');
      setQrText('');
    }

    if (showModal === 'return_asset') {
      api.get<any[]>('/assignments')
        .then(res => {
          const active = (res || []).filter((a: any) => a.status !== 'Returned');
          setAllAssignments(active);
        })
        .catch(err => {
          console.error('Failed to load assignments list for return:', err);
          const active = (dummyDataByEndpoint['/assignments'] || []).filter((a: any) => a.status !== 'Returned');
          setAllAssignments(active);
        });
      setSelectedAssignmentId('');
    }
    setErrorMsg('');
  }, [showModal]);

  // Start Edit
  const handleStartEdit = (recordId: string) => {
    const cleanId = Number(recordId.replace(/^[A-Z]+-/, ''));
    const item = rawItems.find(x => x.id === cleanId);
    if (!item) return;

    setEditingItem(item);

    if (apiEndpoint === '/categories') {
      setCatForm({ name: item.name, code: item.code, description: item.description || '' });
      setShowModal('category');
    } else if (apiEndpoint === '/departments') {
      setDeptForm({ name: item.name, code: item.code, description: item.description || '', managerId: item.managerId ? String(item.managerId) : '' });
      setShowModal('department');
    } else if (apiEndpoint === '/users') {
      setEmpForm({ name: item.name, email: item.email, password: '', roleId: String(item.roleId) });
      setShowModal('employee');
    } else if (apiEndpoint === '/assignments') {
      setAssignForm({ assetId: String(item.assetId), employeeId: String(item.employeeId), notes: item.notes || '' });
      setShowModal('assignment');
    } else if (apiEndpoint === '/repairs') {
      setRepairForm({ assetId: String(item.assetId), description: item.description, priority: item.priority || 'Medium' });
      setShowModal('repair');
    } else if (apiEndpoint === '/transfers') {
      setTransferForm({ assetId: String(item.assetId), toDepartmentId: String(item.toDepartmentId), notes: item.notes || '' });
      setShowModal('transfer');
    } else if (apiEndpoint === '/vendors') {
      setVendorForm({
        name: item.name || '',
        contactName: item.contactName || '',
        email: item.email || '',
        phone: item.phone || '',
        address: item.address || ''
      });
      setShowModal('vendor');
    } else if (apiEndpoint === '/maintenance/records') {
      setServiceForm({
        assetId: item.assetId ? String(item.assetId) : '',
        performedBy: item.performedBy ? String(item.performedBy) : '',
        performedDate: item.performedDate ? item.performedDate.substring(0, 10) : new Date().toISOString().substring(0, 10),
        description: item.description || '',
        cost: item.cost ? String(item.cost) : '',
        status: item.status || 'Completed',
        notes: item.notes || ''
      });
      setShowModal('service');
    } else if (apiEndpoint === '/assets') {
      setWarrantyForm({
        purchaseDate: item.purchaseDate ? item.purchaseDate.substring(0, 10) : '',
        warrantyExpiry: item.warrantyExpiry ? item.warrantyExpiry.substring(0, 10) : '',
        vendorId: item.vendorId ? String(item.vendorId) : ''
      });
      setShowModal('warranty');
    }
  };

  // Delete Record
  const handleDeleteRecord = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this record from database?')) return;
    const cleanId = recordId.replace(/^[A-Z]+-/, '');
    try {
      await api.delete(`${apiEndpoint}/${cleanId}`);
      loadData();
    } catch (err: any) {
      console.warn('API delete record failed, running local delete:', err);
      setDynamicRecords(prev => prev.filter(r => r.id !== recordId));
      setRawItems(prev => prev.filter(item => {
        const itemCleanId = String(item.code || item.id).replace(/^[A-Z]+-/, '');
        return itemCleanId !== cleanId;
      }));
    }
  };

  // Submit handlers
  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name || !catForm.code) {
      setErrorMsg('Name and Code are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      if (editingItem) {
        await api.put(`/categories/${editingItem.id}`, catForm);
      } else {
        await api.post('/categories', catForm);
      }
      setShowModal(null);
      setEditingItem(null);
      setCatForm({ name: '', code: '', description: '' });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete operation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.name || !deptForm.code) {
      setErrorMsg('Name and Code are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const body: any = { name: deptForm.name, code: deptForm.code, description: deptForm.description };
      if (deptForm.managerId) body.managerId = Number(deptForm.managerId);

      if (editingItem) {
        await api.put(`/departments/${editingItem.id}`, body);
      } else {
        await api.post('/departments', body);
      }
      setShowModal(null);
      setEditingItem(null);
      setDeptForm({ name: '', code: '', description: '', managerId: '' });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete department operation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.name || !empForm.email || (!editingItem && !empForm.password)) {
      setErrorMsg('Required fields must be completed.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const body: any = {
        name: empForm.name,
        email: empForm.email,
        roleId: Number(empForm.roleId)
      };
      if (empForm.password) body.password = empForm.password;

      if (editingItem) {
        await api.put(`/users/${editingItem.id}`, body);
      } else {
        await api.post('/users', body);
      }
      setShowModal(null);
      setEditingItem(null);
      setEmpForm({ name: '', email: '', password: 'Password123', roleId: '4' });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete employee action.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignForm.assetId || !assignForm.employeeId) {
      setErrorMsg('Asset and Employee selection are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const body = {
        assetId: Number(assignForm.assetId),
        employeeId: Number(assignForm.employeeId),
        notes: assignForm.notes
      };

      if (editingItem) {
        await api.put(`/assignments/${editingItem.id}`, body);
      } else {
        await api.post('/assignments', body);
      }
      setShowModal(null);
      setEditingItem(null);
      setAssignForm({ assetId: '', employeeId: '', notes: '' });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update assignment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRepair = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairForm.assetId || !repairForm.description) {
      setErrorMsg('Asset and Description are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const body = {
        assetId: Number(repairForm.assetId),
        description: repairForm.description,
        priority: repairForm.priority
      };

      if (editingItem) {
        await api.put(`/repairs/${editingItem.id}`, body);
      } else {
        await api.post('/repairs', body);
      }
      setShowModal(null);
      setEditingItem(null);
      setRepairForm({ assetId: '', description: '', priority: 'Medium' });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to log repair request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferForm.assetId || !transferForm.toDepartmentId) {
      setErrorMsg('Asset and Department selections are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      const body = {
        assetId: Number(transferForm.assetId),
        toDepartmentId: Number(transferForm.toDepartmentId),
        notes: transferForm.notes
      };

      if (editingItem) {
        await api.put(`/transfers/${editingItem.id}`, body);
      } else {
        await api.post('/transfers', body);
      }
      setShowModal(null);
      setEditingItem(null);
      setTransferForm({ assetId: '', toDepartmentId: '', notes: '' });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to complete transfer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorForm.name) {
      setErrorMsg('Vendor name is required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      if (editingItem) {
        await api.put(`/vendors/${editingItem.id}`, vendorForm);
      } else {
        await api.post('/vendors', vendorForm);
      }
      setShowModal(null);
      setEditingItem(null);
      setVendorForm({ name: '', contactName: '', email: '', phone: '', address: '' });
      loadData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register vendor.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceForm.assetId || !serviceForm.performedBy || !serviceForm.description) {
      setErrorMsg('Asset, Performed By, and Description are required.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    const body = {
      assetId: Number(serviceForm.assetId),
      performedBy: Number(serviceForm.performedBy),
      performedDate: serviceForm.performedDate,
      description: serviceForm.description,
      cost: parseFloat(serviceForm.cost) || 0,
      status: serviceForm.status,
      notes: serviceForm.notes
    };
    try {
      if (editingItem) {
        await api.put(`/maintenance/records/${editingItem.id}`, body);
      } else {
        await api.post('/maintenance/records', body);
      }
      setShowModal(null);
      setEditingItem(null);
      setServiceForm({
        assetId: '',
        performedBy: '',
        performedDate: new Date().toISOString().substring(0, 10),
        description: '',
        cost: '',
        status: 'Completed',
        notes: ''
      });
      loadData();
    } catch (err: any) {
      console.warn('API service record submit failed, running local submit:', err);
      // Fallback
      if (editingItem) {
        const updatedRaw = rawItems.map(item => item.id === editingItem.id ? { ...item, ...body } : item);
        setRawItems(updatedRaw);
        if (mapRecord) setDynamicRecords(updatedRaw.map(mapRecord));
      } else {
        const selectedAssetObj = allAssets.find(a => a.id === body.assetId);
        const selectedUserObj = users.find(u => u.id === body.performedBy);
        const newItem = {
          id: Date.now(),
          ...body,
          Asset: selectedAssetObj ? { name: selectedAssetObj.name } : { name: `Asset #${body.assetId}` },
          PerformedBy: selectedUserObj ? { name: selectedUserObj.name } : { name: `User #${body.performedBy}` }
        };
        const updatedRaw = [...rawItems, newItem];
        setRawItems(updatedRaw);
        if (mapRecord) setDynamicRecords(updatedRaw.map(mapRecord));
      }
      setShowModal(null);
      setEditingItem(null);
      setServiceForm({
        assetId: '',
        performedBy: '',
        performedDate: new Date().toISOString().substring(0, 10),
        description: '',
        cost: '',
        status: 'Completed',
        notes: ''
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitWarranty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    const body = {
      purchaseDate: warrantyForm.purchaseDate || null,
      warrantyExpiry: warrantyForm.warrantyExpiry || null,
      vendorId: warrantyForm.vendorId ? Number(warrantyForm.vendorId) : null
    };
    try {
      await api.put(`/assets/${editingItem.id}`, body);
      setShowModal(null);
      setEditingItem(null);
      setWarrantyForm({ purchaseDate: '', warrantyExpiry: '', vendorId: '' });
      loadData();
    } catch (err: any) {
      console.warn('API update warranty failed, running local update:', err);
      if (editingItem) {
        const selectedVendor = vendors.find(v => v.id === body.vendorId);
        const updatedRaw = rawItems.map(item => item.id === editingItem.id ? { 
          ...item, 
          ...body,
          Vendor: selectedVendor ? { name: selectedVendor.name } : item.Vendor
        } : item);
        setRawItems(updatedRaw);
        if (mapRecord) setDynamicRecords(updatedRaw.map(mapRecord));
      }
      setShowModal(null);
      setEditingItem(null);
      setWarrantyForm({ purchaseDate: '', warrantyExpiry: '', vendorId: '' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateQR = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      let url = '';
      if (qrType === 'asset') {
        if (!selectedQrAssetId) {
          setErrorMsg('Please select an asset.');
          setSubmitting(false);
          return;
        }
        url = `/assets/${selectedQrAssetId}/qrcode`;
      } else {
        if (!qrText) {
          setErrorMsg('Please enter custom text.');
          setSubmitting(false);
          return;
        }
        url = `/assets/qrcode/generate?text=${encodeURIComponent(qrText)}`;
      }

      const res = await api.get<{ qrCodeUrl: string }>(url);
      if (res && res.qrCodeUrl) {
        setGeneratedQrCodeUrl(res.qrCodeUrl);
      } else {
        throw new Error('No QR Code returned');
      }
    } catch (err: any) {
      console.warn('API QR generation failed, generating client-side QR fallback:', err);
      const textToEncode = qrType === 'asset' ? `Asset ID: ${selectedQrAssetId}` : qrText;
      const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(textToEncode)}`;
      setGeneratedQrCodeUrl(fallbackUrl);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignmentId) {
      setErrorMsg('Please select an assignment.');
      return;
    }
    setSubmitting(true);
    setErrorMsg('');
    try {
      await api.put(`/assignments/${selectedAssignmentId}`, {});
      setShowModal(null);
      setSelectedAssignmentId('');
      loadData();
    } catch (err: any) {
      console.warn('API return assignment failed, running local fallback:', err);
      const updatedRaw = rawItems.map(item => item.id === Number(selectedAssignmentId) ? { ...item, status: 'Returned' } : item);
      setRawItems(updatedRaw);
      if (mapRecord) setDynamicRecords(updatedRaw.map(mapRecord));
      setShowModal(null);
      setSelectedAssignmentId('');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(null);
    setEditingItem(null);
    setErrorMsg('');
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, gap: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: theme.colors.primaryLight, color: theme.colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderIcon />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: theme.colors.text.primary, letterSpacing: '-0.02em' }}>
              {title}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: theme.colors.text.muted }}>{description}</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {actions.map((action) => {
            const ActionIcon = action.icon ? Icons[action.icon] : undefined;
            const handleClick = () => {
              if (action.label === 'Add Category') {
                setShowModal('category');
              } else if (action.label === 'Add Department') {
                setShowModal('department');
              } else if (action.label === 'Add Employee') {
                setShowModal('employee');
              } else if (action.label === 'Assign Asset') {
                setShowModal('assignment');
              } else if (action.label === 'Create Repair') {
                setShowModal('repair');
              } else if (action.label === 'New Transfer') {
                setShowModal('transfer');
              } else if (action.label === 'Add Vendor') {
                setShowModal('vendor');
              } else if (action.label === 'Add Service Entry') {
                setShowModal('service');
              } else if (action.label === 'Generate QR') {
                setShowModal('qrcode');
              } else if (action.label === 'Return Asset') {
                setShowModal('return_asset');
              } else if (action.onClick) {
                action.onClick();
              }
            };

            return (
              <Button key={action.label} variant={action.variant ?? 'secondary'} icon={ActionIcon ? <ActionIcon /> : undefined} onClick={handleClick}>
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {liveStats.map((stat) => {
          const StatIcon = Icons[stat.icon];

          return (
            <Card key={stat.label} padding="16px 20px">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StatIcon />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: theme.colors.text.muted }}>{stat.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: theme.colors.text.primary }}>{stat.value}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: workflow ? 'minmax(0, 1.6fr) minmax(320px, 1fr)' : '1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Card padding="0">
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>Records</span>
              <span style={{ fontSize: 12, color: theme.colors.text.muted }}>
                {loading ? 'Loading...' : `${dynamicRecords.length} items`}
              </span>
            </div>
            <div>
              {loading ? (
                <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: theme.colors.text.muted, fontWeight: 500 }}>
                  Fetching data from database...
                </div>
              ) : dynamicRecords.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', fontSize: 14, color: theme.colors.text.muted, fontWeight: 500 }}>
                  No records found.
                </div>
              ) : (
                dynamicRecords.map((record, index) => (
                  <div
                    key={record.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      padding: '16px 20px',
                      borderBottom: index < dynamicRecords.length - 1 ? `1px solid ${theme.colors.borderLight}` : 'none',
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#FAFBFC', color: theme.colors.primary, border: `1px solid ${theme.colors.borderLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <HeaderIcon />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>{record.title}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: theme.colors.primary, background: theme.colors.primaryLight, padding: '2px 8px', borderRadius: 99 }}>{record.id}</span>
                        {record.status && <Badge variant={statusVariant(record.status)}>{record.status}</Badge>}
                      </div>
                      <div style={{ fontSize: 13, color: theme.colors.text.muted, marginBottom: 6 }}>{record.subtitle}</div>
                      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: theme.colors.text.light }}>
                        {record.meta.map((item) => <span key={item}>{item}</span>)}
                      </div>
                    </div>
                    {apiEndpoint && (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Button variant="secondary" size="sm" icon={<Icons.Edit />} onClick={() => handleStartEdit(record.id)}>Edit</Button>
                        <Button variant="danger" size="sm" icon={<Icons.Trash />} onClick={() => handleDeleteRecord(record.id)}>Delete</Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {workflow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Card>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Workflow</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {workflow.map((step, index) => (
                  <div key={step} style={{ display: 'flex', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: 26, height: 26, borderRadius: 99, background: index === 0 ? theme.colors.primary : '#F3F4F6', color: index === 0 ? '#fff' : theme.colors.text.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
                        {index + 1}
                      </div>
                      {index < workflow.length - 1 && <div style={{ width: 1, height: 22, background: theme.colors.border, marginTop: 6 }} />}
                    </div>
                    <div style={{ paddingTop: 4, fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>{step}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: theme.colors.text.primary }}>Features</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {features.map((feature) => (
                  <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: theme.colors.success.main }}><Icons.CheckCircle /></span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.text.secondary }}>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Creation/Assignment/Edit Modals */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: theme.font
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, width: '100%', maxWidth: 460,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            padding: '24px 28px', border: `1px solid ${theme.colors.borderLight}`,
            display: 'flex', flexDirection: 'column', gap: 18
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: theme.colors.text.primary }}>
                {showModal === 'category' && (editingItem ? 'Edit Category' : 'Add New Category')}
                {showModal === 'department' && (editingItem ? 'Edit Department' : 'Add New Department')}
                {showModal === 'employee' && (editingItem ? 'Edit Employee Details' : 'Add New Employee')}
                {showModal === 'assignment' && (editingItem ? 'Modify Asset Assignment' : 'Assign Asset to Employee')}
                {showModal === 'repair' && (editingItem ? 'Modify Repair Ticket' : 'Log Repair Ticket')}
                {showModal === 'transfer' && (editingItem ? 'Edit Transfer Log' : 'Execute Transfer')}
                {showModal === 'vendor' && (editingItem ? 'Edit Vendor Details' : 'Register New Vendor')}
                {showModal === 'service' && (editingItem ? 'Edit Service Record' : 'Add New Service Entry')}
              </h3>
              <button onClick={handleCloseModal} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: theme.colors.text.muted, display: 'flex', alignItems: 'center', padding: 4 }}>
                <Icons.X />
              </button>
            </div>

            {errorMsg && (
              <div style={{ fontSize: 13, color: '#EF4444', background: '#FEF2F2', border: '1px solid #FEE2E2', borderRadius: 8, padding: '10px 14px', fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            {/* Category Form */}
            {showModal === 'category' && (
              <form onSubmit={handleSubmitCategory} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Category Name *</label>
                  <input type="text" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} placeholder="e.g. Laboratory Equipment" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Category Code *</label>
                  <input type="text" value={catForm.code} onChange={e => setCatForm({...catForm, code: e.target.value.toUpperCase()})} placeholder="e.g. LAB" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Description</label>
                  <textarea value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} placeholder="Describe items grouped under this category" rows={3} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Processing...' : editingItem ? 'Update Category' : 'Create Category'}
                  </Button>
                </div>
              </form>
            )}

            {/* Department Form */}
            {showModal === 'department' && (
              <form onSubmit={handleSubmitDepartment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Department Name *</label>
                  <input type="text" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} placeholder="e.g. Mechanical Engineering" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Department Code *</label>
                  <input type="text" value={deptForm.code} onChange={e => setDeptForm({...deptForm, code: e.target.value.toUpperCase()})} placeholder="e.g. MECH" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Department Manager</label>
                  <select value={deptForm.managerId} onChange={e => setDeptForm({...deptForm, managerId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Select Manager</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.Role?.name || 'User'})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Description</label>
                  <textarea value={deptForm.description} onChange={e => setDeptForm({...deptForm, description: e.target.value})} placeholder="Optional department brief" rows={3} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Processing...' : editingItem ? 'Update Department' : 'Create Department'}
                  </Button>
                </div>
              </form>
            )}

            {/* Employee Form */}
            {showModal === 'employee' && (
              <form onSubmit={handleSubmitEmployee} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Full Name *</label>
                  <input type="text" value={empForm.name} onChange={e => setEmpForm({...empForm, name: e.target.value})} placeholder="e.g. Robert Downey" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Email Address *</label>
                  <input type="email" value={empForm.email} onChange={e => setEmpForm({...empForm, email: e.target.value})} placeholder="e.g. robert@assetflow.com" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                {!editingItem && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Default Password *</label>
                    <input type="password" value={empForm.password} onChange={e => setEmpForm({...empForm, password: e.target.value})} placeholder="Password123" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>System Role *</label>
                  <select value={empForm.roleId} onChange={e => setEmpForm({...empForm, roleId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="1">Admin</option>
                    <option value="2">Manager</option>
                    <option value="3">Technician</option>
                    <option value="4">Employee</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Processing...' : editingItem ? 'Update Employee' : 'Create Employee'}
                  </Button>
                </div>
              </form>
            )}

            {/* Assignment Form */}
            {showModal === 'assignment' && (
              <form onSubmit={handleSubmitAssignment} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Available Asset *</label>
                  <select value={assignForm.assetId} onChange={e => setAssignForm({...assignForm, assetId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Choose Asset</option>
                    {editingItem && <option value={editingItem.assetId}>{editingItem.Asset?.name || 'Current Asset'}</option>}
                    {availableAssets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.serialNumber || `AST-${a.id}`})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Employee / Assignee *</label>
                  <select value={assignForm.employeeId} onChange={e => setAssignForm({...assignForm, employeeId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Choose Employee</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Assignment Notes</label>
                  <textarea value={assignForm.notes} onChange={e => setAssignForm({...assignForm, notes: e.target.value})} placeholder="Optional details" rows={2} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Assigning...' : editingItem ? 'Update Assignment' : 'Assign Asset'}
                  </Button>
                </div>
              </form>
            )}

            {/* Repair Form */}
            {showModal === 'repair' && (
              <form onSubmit={handleSubmitRepair} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Asset for Repair *</label>
                  <select value={repairForm.assetId} onChange={e => setRepairForm({...repairForm, assetId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Choose Asset</option>
                    {editingItem && <option value={editingItem.assetId}>{editingItem.Asset?.name || 'Current Asset'}</option>}
                    {allAssets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.serialNumber || `AST-${a.id}`})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Priority *</label>
                  <select value={repairForm.priority} onChange={e => setRepairForm({...repairForm, priority: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Issue Details / Description *</label>
                  <textarea value={repairForm.description} onChange={e => setRepairForm({...repairForm, description: e.target.value})} placeholder="Describe what is wrong with the asset" rows={3} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : editingItem ? 'Update Repair' : 'Log Repair Ticket'}
                  </Button>
                </div>
              </form>
            )}

            {/* Transfer Form */}
            {showModal === 'transfer' && (
              <form onSubmit={handleSubmitTransfer} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Asset to Transfer *</label>
                  <select value={transferForm.assetId} onChange={e => setTransferForm({...transferForm, assetId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Choose Asset</option>
                    {editingItem && <option value={editingItem.assetId}>{editingItem.Asset?.name || 'Current Asset'}</option>}
                    {allAssets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.serialNumber || `AST-${a.id}`})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Destination Department *</label>
                  <select value={transferForm.toDepartmentId} onChange={e => setTransferForm({...transferForm, toDepartmentId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Choose Department</option>
                    {allDepts.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Transfer Notes</label>
                  <textarea value={transferForm.notes} onChange={e => setTransferForm({...transferForm, notes: e.target.value})} placeholder="Optional details" rows={2} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Processing...' : editingItem ? 'Update Transfer' : 'Execute Transfer'}
                  </Button>
                </div>
              </form>
            )}

            {/* Vendor Form */}
            {showModal === 'vendor' && (
              <form onSubmit={handleSubmitVendor} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Vendor Name *</label>
                  <input type="text" value={vendorForm.name} onChange={e => setVendorForm({...vendorForm, name: e.target.value})} placeholder="e.g. Apple Business" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} required />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Contact Person</label>
                  <input type="text" value={vendorForm.contactName} onChange={e => setVendorForm({...vendorForm, contactName: e.target.value})} placeholder="e.g. Sarah Jobs" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Email Address</label>
                  <input type="email" value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email: e.target.value})} placeholder="e.g. service@dell.com" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Phone Number</label>
                  <input type="text" value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone: e.target.value})} placeholder="e.g. +1 555-0199" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Address</label>
                  <input type="text" value={vendorForm.address} onChange={e => setVendorForm({...vendorForm, address: e.target.value})} placeholder="e.g. Round Rock, TX" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Saving...' : editingItem ? 'Update Vendor' : 'Add Vendor'}
                  </Button>
                </div>
              </form>
            )}

            {/* Service Form */}
            {showModal === 'service' && (
              <form onSubmit={handleSubmitService} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Asset *</label>
                  <select value={serviceForm.assetId} onChange={e => setServiceForm({...serviceForm, assetId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Select Asset</option>
                    {allAssets.map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.serialNumber || a.model || `ID: ${a.id}`})</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Performed By (Technician) *</label>
                  <select value={serviceForm.performedBy} onChange={e => setServiceForm({...serviceForm, performedBy: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Select Technician</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Service Cost ($) *</label>
                    <input type="number" step="0.01" value={serviceForm.cost} onChange={e => setServiceForm({...serviceForm, cost: e.target.value})} placeholder="0.00" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Performed Date *</label>
                    <input type="date" value={serviceForm.performedDate} onChange={e => setServiceForm({...serviceForm, performedDate: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Description *</label>
                  <input type="text" value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} placeholder="e.g. Cleared thermal paste, replaced battery" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Status *</label>
                  <select value={serviceForm.status} onChange={e => setServiceForm({...serviceForm, status: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Deferred">Deferred</option>
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Notes</label>
                  <textarea value={serviceForm.notes} onChange={e => setServiceForm({...serviceForm, notes: e.target.value})} placeholder="Additional technician notes" rows={2} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', resize: 'vertical' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Processing...' : editingItem ? 'Update Service' : 'Add Service'}
                  </Button>
                </div>
              </form>
            )}

            {/* Warranty Form */}
            {showModal === 'warranty' && (
              <form onSubmit={handleSubmitWarranty} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: theme.colors.text.primary }}>Asset: {editingItem?.name || 'Unknown Asset'}</span>
                  <span style={{ fontSize: 12, color: theme.colors.text.muted }}>Serial: {editingItem?.serialNumber || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Vendor</label>
                  <select value={warrantyForm.vendorId} onChange={e => setWarrantyForm({...warrantyForm, vendorId: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Select Vendor</option>
                    {vendors.map(v => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Purchase Date</label>
                  <input type="date" value={warrantyForm.purchaseDate} onChange={e => setWarrantyForm({...warrantyForm, purchaseDate: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Warranty Expiry Date</label>
                  <input type="date" value={warrantyForm.warrantyExpiry} onChange={e => setWarrantyForm({...warrantyForm, warrantyExpiry: e.target.value})} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Updating...' : 'Update Warranty'}
                  </Button>
                </div>
              </form>
            )}

            {/* QR Code Generator Form */}
            {showModal === 'qrcode' && (
              <form onSubmit={handleGenerateQR} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="radio" name="qrType" checked={qrType === 'asset'} onChange={() => { setQrType('asset'); setGeneratedQrCodeUrl(''); }} />
                    For Asset
                  </label>
                  <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="radio" name="qrType" checked={qrType === 'custom'} onChange={() => { setQrType('custom'); setGeneratedQrCodeUrl(''); }} />
                    Custom Text
                  </label>
                </div>

                {qrType === 'asset' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Asset *</label>
                    <select value={selectedQrAssetId} onChange={e => { setSelectedQrAssetId(e.target.value); setGeneratedQrCodeUrl(''); }} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                      <option value="">Choose Asset</option>
                      {allAssets.map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.serialNumber || `AST-${a.id}`})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Enter Custom Text / URL *</label>
                    <input type="text" value={qrText} onChange={e => { setQrText(e.target.value); setGeneratedQrCodeUrl(''); }} placeholder="e.g. Asset location or serial link" style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none' }} />
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 6 }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Generating...' : 'Generate QR Code'}
                  </Button>
                </div>

                {generatedQrCodeUrl && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 14, padding: '16px 0', borderTop: `1px solid ${theme.colors.borderLight}` }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: theme.colors.text.primary }}>Generated QR Code:</span>
                    <img src={generatedQrCodeUrl} alt="Generated QR Code" style={{ width: 180, height: 180, border: `1px solid ${theme.colors.border}`, borderRadius: 8, padding: 8 }} />
                    <a href={generatedQrCodeUrl} download="qrcode.png" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                      <Button variant="secondary" type="button" icon={<Icons.Download />}>Download QR Code</Button>
                    </a>
                  </div>
                )}
              </form>
            )}

            {/* Return Asset Form */}
            {showModal === 'return_asset' && (
              <form onSubmit={handleReturnAsset} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: theme.colors.text.secondary }}>Select Active Assignment *</label>
                  <select value={selectedAssignmentId} onChange={e => setSelectedAssignmentId(e.target.value)} style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${theme.colors.border}`, fontSize: 14, fontFamily: theme.font, outline: 'none', background: '#fff' }}>
                    <option value="">Select Assignment</option>
                    {allAssignments.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.Asset?.name || `Asset #${a.assetId}`} (Assigned to: {a.Employee?.name || `User #${a.employeeId}`})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'flex-end' }}>
                  <Button variant="secondary" type="button" onClick={handleCloseModal}>Cancel</Button>
                  <Button variant="primary" type="submit" disabled={submitting}>
                    {submitting ? 'Processing...' : 'Process Return'}
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
