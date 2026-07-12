import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiPlus, FiSearch, FiEdit, FiTrash2, FiEye } from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Assets = () => {
  const { hasRole } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [vendors, setVendors] = useState([]);

  // Search/Filters states
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modals state
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showViewDetails, setShowViewDetails] = useState(false);
  
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [formName, setFormName] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formCatId, setFormCatId] = useState('');
  const [formDeptId, setFormDeptId] = useState('');
  const [formCondition, setFormCondition] = useState('Excellent');
  const [formStatus, setFormStatus] = useState('Available');
  const [formPurchaseDate, setFormPurchaseDate] = useState('');
  const [formPurchaseCost, setFormPurchaseCost] = useState('');
  const [formVendorId, setFormVendorId] = useState('');
  const [formWarranty, setFormWarranty] = useState('');

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets', {
        params: {
          search,
          categoryId: categoryFilter,
          departmentId: departmentFilter,
          status: statusFilter,
          page,
          limit: 8
        }
      });
      setAssets(response.data.assets);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching assets inventory');
    }
  };

  const fetchMetadata = async () => {
    try {
      const [cats, depts, vends] = await Promise.all([
        api.get('/categories'),
        api.get('/departments'),
        api.get('/vendors')
      ]);
      setCategories(cats.data);
      setDepartments(depts.data);
      setVendors(vends.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [search, categoryFilter, departmentFilter, statusFilter, page]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedAsset(null);
    setFormName('');
    setFormSerial('');
    setFormModel('');
    setFormDesc('');
    setFormCatId('');
    setFormDeptId('');
    setFormCondition('Excellent');
    setFormStatus('Available');
    setFormPurchaseDate('');
    setFormPurchaseCost('');
    setFormVendorId('');
    setFormWarranty('');
    setShowAddEdit(true);
  };

  const handleOpenEdit = (asset) => {
    setIsEditing(true);
    setSelectedAsset(asset);
    setFormName(asset.name);
    setFormSerial(asset.serialNumber || '');
    setFormModel(asset.model || '');
    setFormDesc(asset.description || '');
    setFormCatId(asset.categoryId || '');
    setFormDeptId(asset.departmentId || '');
    setFormCondition(asset.condition);
    setFormStatus(asset.status);
    setFormPurchaseDate(asset.purchaseDate || '');
    setFormPurchaseCost(asset.purchaseCost || '');
    setFormVendorId(asset.vendorId || '');
    setFormWarranty(asset.warrantyExpiry || '');
    setShowAddEdit(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formName) {
      toast.error('Asset name is required');
      return;
    }

    const payload = {
      name: formName,
      serialNumber: formSerial || null,
      model: formModel || null,
      description: formDesc || null,
      categoryId: formCatId ? parseInt(formCatId) : null,
      departmentId: formDeptId ? parseInt(formDeptId) : null,
      condition: formCondition,
      status: formStatus,
      purchaseDate: formPurchaseDate || null,
      purchaseCost: formPurchaseCost ? parseFloat(formPurchaseCost) : null,
      vendorId: formVendorId ? parseInt(formVendorId) : null,
      warrantyExpiry: formWarranty || null,
    };

    try {
      if (isEditing) {
        await api.put(`/assets/${selectedAsset.id}`, payload);
        toast.success('Asset record updated');
      } else {
        await api.post('/assets', payload);
        toast.success('Asset created successfully');
      }
      setShowAddEdit(false);
      fetchAssets();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error saving asset details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await api.delete(`/assets/${id}`);
        toast.success('Asset record deleted');
        fetchAssets();
      } catch (error) {
        toast.error('Error deleting asset');
      }
    }
  };

  const handleShowQR = (asset) => {
    setSelectedAsset(asset);
    setShowQR(true);
  };

  const handleShowDetails = async (id) => {
    try {
      const response = await api.get(`/assets/${id}`);
      setSelectedAsset(response.data);
      setShowViewDetails(true);
    } catch (error) {
      toast.error('Error fetching asset logs details');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Asset Inventory" />

        <div className="glass-card p-4 mt-4 animated-fade-in">
          {/* Toolbar */}
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
            <div className="d-flex flex-grow-1 gap-2 max-width-md">
              <div className="input-group" style={{ maxWidth: '400px' }}>
                <span className="input-group-text bg-transparent border-end-0 border-color text-muted">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search assets by name or serial..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              
              <select className="form-select w-auto" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Assigned">Assigned</option>
                <option value="Under Maintenance">Under Maintenance</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            {hasRole(['Admin', 'Manager']) && (
              <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={handleOpenAdd}>
                <FiPlus />
                <span>Add Asset</span>
              </button>
            )}
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Serial Number</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Condition</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.length > 0 ? (
                  assets.map((asset) => (
                    <tr key={asset.id}>
                      <td className="font-weight-bold text-white">{asset.name}</td>
                      <td>{asset.serialNumber || '—'}</td>
                      <td>{asset.Category?.name || '—'}</td>
                      <td>{asset.Department?.name || '—'}</td>
                      <td>
                        <span className={`badge badge-custom badge-${asset.status.toLowerCase().replace(' ', '-')}`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-white-50 small">{asset.condition}</span>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-outline-custom p-2" title="View Logs & Details" onClick={() => handleShowDetails(asset.id)}>
                            <FiEye />
                          </button>
                          <button className="btn btn-outline-custom p-2" title="Show QR Code" onClick={() => handleShowQR(asset)}>
                            <FaQrcode />
                          </button>
                          {hasRole(['Admin', 'Manager']) && (
                            <button className="btn btn-outline-custom p-2" title="Edit Asset" onClick={() => handleOpenEdit(asset)}>
                              <FiEdit />
                            </button>
                          )}
                          {hasRole(['Admin']) && (
                            <button className="btn btn-outline-custom p-2 text-danger" title="Delete Asset" onClick={() => handleDelete(asset.id)}>
                              <FiTrash2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No assets found matching filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <span className="text-muted small">Page {page} of {totalPages}</span>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-custom" disabled={page === 1} onClick={() => setPage(page - 1)}>
                  Previous
                </button>
                <button className="btn btn-outline-custom" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal show={showAddEdit} onHide={() => setShowAddEdit(false)} size="lg" centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>{isEditing ? 'Modify Asset Record' : 'Register New Asset'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body className="row g-3">
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Asset Name</Form.Label>
                  <Form.Control type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Serial Number (S/N)</Form.Label>
                  <Form.Control type="text" value={formSerial} onChange={(e) => setFormSerial(e.target.value)} />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Model / Specs</Form.Label>
                  <Form.Control type="text" value={formModel} onChange={(e) => setFormModel(e.target.value)} />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Category</Form.Label>
                  <Form.Select value={formCatId} onChange={(e) => setFormCatId(e.target.value)}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Allocated Department</Form.Label>
                  <Form.Select value={formDeptId} onChange={(e) => setFormDeptId(e.target.value)}>
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Supplier Vendor</Form.Label>
                  <Form.Select value={formVendorId} onChange={(e) => setFormVendorId(e.target.value)}>
                    <option value="">Select Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Asset Condition</Form.Label>
                  <Form.Select value={formCondition} onChange={(e) => setFormCondition(e.target.value)}>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {isEditing && (
                <div className="col-12 col-md-6">
                  <Form.Group>
                    <Form.Label className="small text-muted">Asset Status</Form.Label>
                    <Form.Select value={formStatus} onChange={(e) => setFormStatus(e.target.value)}>
                      <option value="Available">Available</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                      <option value="Retired">Retired</option>
                    </Form.Select>
                  </Form.Group>
                </div>
              )}
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Purchase Date</Form.Label>
                  <Form.Control type="date" value={formPurchaseDate} onChange={(e) => setFormPurchaseDate(e.target.value)} />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Purchase Cost ($)</Form.Label>
                  <Form.Control type="number" step="0.01" value={formPurchaseCost} onChange={(e) => setFormPurchaseCost(e.target.value)} />
                </Form.Group>
              </div>
              <div className="col-12 col-md-6">
                <Form.Group>
                  <Form.Label className="small text-muted">Warranty Expiration</Form.Label>
                  <Form.Control type="date" value={formWarranty} onChange={(e) => setFormWarranty(e.target.value)} />
                </Form.Group>
              </div>
              <div className="col-12">
                <Form.Group>
                  <Form.Label className="small text-muted">Asset Description</Form.Label>
                  <Form.Control as="textarea" rows={2} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
                </Form.Group>
              </div>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowAddEdit(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Save Changes
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* QR Code Modal */}
        <Modal show={showQR} onHide={() => setShowQR(false)} centered contentClassName="glass-card text-white text-center p-3">
          <Modal.Header closeButton closeVariant="white" className="border-0 pb-0">
            <Modal.Title className="w-100">Asset QR Identification</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAsset?.qrCodeUrl ? (
              <div>
                <img src={selectedAsset.qrCodeUrl} alt="QR Code" className="img-fluid rounded mb-3 bg-white p-2" style={{ maxWidth: '240px' }} />
                <h5 className="font-weight-bold text-white">{selectedAsset.name}</h5>
                <p className="text-muted small">S/N: {selectedAsset.serialNumber || 'N/A'}</p>
                <div className="text-white-50 small mt-2">Scan code to scan asset audit data</div>
              </div>
            ) : (
              <div className="text-muted">No QR Code generated for this asset.</div>
            )}
          </Modal.Body>
        </Modal>

        {/* View Details / Logs Modal */}
        <Modal show={showViewDetails} onHide={() => setShowViewDetails(false)} size="lg" centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>{selectedAsset?.name} Log Audit Trail</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {selectedAsset && (
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <h6 className="font-weight-bold text-primary mb-2">Specifications</h6>
                  <ul className="list-unstyled text-white-50">
                    <li><strong>Model:</strong> {selectedAsset.model || 'N/A'}</li>
                    <li><strong>S/N:</strong> {selectedAsset.serialNumber || 'N/A'}</li>
                    <li><strong>Condition:</strong> {selectedAsset.condition}</li>
                    <li><strong>Status:</strong> <span className={`badge badge-custom badge-${selectedAsset.status.toLowerCase().replace(' ', '-')}`}>{selectedAsset.status}</span></li>
                  </ul>
                </div>
                <div className="col-12 col-md-6">
                  <h6 className="font-weight-bold text-primary mb-2">Financials</h6>
                  <ul className="list-unstyled text-white-50">
                    <li><strong>Purchase Date:</strong> {selectedAsset.purchaseDate || 'N/A'}</li>
                    <li><strong>Purchase Cost:</strong> ${selectedAsset.purchaseCost || '0.00'}</li>
                    <li><strong>Warranty Expiration:</strong> {selectedAsset.warrantyExpiry || 'N/A'}</li>
                    <li><strong>Vendor:</strong> {selectedAsset.Vendor?.name || 'N/A'}</li>
                  </ul>
                </div>

                <hr className="border-color my-3" />

                {/* Assignments History */}
                <div className="col-12">
                  <h6 className="font-weight-bold text-white mb-2">Checkout/Assignment History</h6>
                  {selectedAsset.Assignments?.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-custom table-sm">
                        <thead>
                          <tr>
                            <th>Employee</th>
                            <th>Date Assigned</th>
                            <th>Date Returned</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAsset.Assignments.map((a) => (
                            <tr key={a.id}>
                              <td>{a.Employee?.name}</td>
                              <td>{new Date(a.assignedDate).toLocaleDateString()}</td>
                              <td>{a.returnDate ? new Date(a.returnDate).toLocaleDateString() : '—'}</td>
                              <td>
                                <span className={`badge badge-custom badge-${a.status === 'Active' ? 'assigned' : 'available'}`}>{a.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted small">No assignments logged for this asset.</div>
                  )}
                </div>

                {/* Maintenance Records */}
                <div className="col-12">
                  <h6 className="font-weight-bold text-white mb-2">Maintenance History</h6>
                  {selectedAsset.MaintenanceRecords?.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-custom table-sm">
                        <thead>
                          <tr>
                            <th>Technician</th>
                            <th>Date Performed</th>
                            <th>Cost</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedAsset.MaintenanceRecords.map((m) => (
                            <tr key={m.id}>
                              <td>{m.Technician?.name || 'Unknown'}</td>
                              <td>{new Date(m.performedDate).toLocaleDateString()}</td>
                              <td>${m.cost}</td>
                              <td>{m.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-muted small">No maintenance logs registered.</div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

      </div>
    </div>
  );
};

export default Assets;
