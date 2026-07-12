import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiPlus, FiCheckSquare, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Repairs = () => {
  const { hasRole } = useContext(AuthContext);

  const [repairs, setRepairs] = useState([]);
  const [assets, setAssets] = useState([]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState(null);

  // Form states (Create)
  const [formAssetId, setFormAssetId] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPriority, setFormPriority] = useState('Medium');

  // Form states (Resolve)
  const [resolveStatus, setResolveStatus] = useState('Completed');
  const [resolveCost, setResolveCost] = useState('');
  const [resolveNotes, setResolveNotes] = useState('');

  const fetchRepairs = async () => {
    try {
      const response = await api.get('/repairs');
      setRepairs(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching repair logs');
    }
  };

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets', { params: { limit: 100 } });
      setAssets(response.data.assets);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRepairs();
    fetchAssets();
  }, []);

  const handleOpenAdd = () => {
    setFormAssetId('');
    setFormDesc('');
    setFormPriority('Medium');
    setShowAddModal(true);
  };

  const handleOpenResolve = (repair) => {
    setSelectedRepair(repair);
    setResolveStatus('Completed');
    setResolveCost(repair.cost || '');
    setResolveNotes(repair.notes || '');
    setShowResolveModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formAssetId || !formDesc) {
      toast.error('Asset target and description are required');
      return;
    }

    try {
      await api.post('/repairs', {
        assetId: parseInt(formAssetId),
        description: formDesc,
        priority: formPriority,
      });
      toast.success('Repair request successfully submitted');
      setShowAddModal(false);
      fetchRepairs();
    } catch (error) {
      toast.error('Error submitting repair request');
    }
  };

  const handleResolve = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/repairs/${selectedRepair.id}`, {
        status: resolveStatus,
        cost: resolveCost ? parseFloat(resolveCost) : 0.00,
        notes: resolveNotes,
      });
      toast.success('Repair request status updated');
      setShowResolveModal(false);
      fetchRepairs();
    } catch (error) {
      toast.error('Error updating repair request');
    }
  };

  const handleSetInProgress = async (id) => {
    try {
      await api.put(`/repairs/${id}`, { status: 'In Progress' });
      toast.success('Ticket marked in progress');
      fetchRepairs();
    } catch (error) {
      toast.error('Error updating ticket');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Asset Repair Tickets" />

        <div className="glass-card p-4 mt-4 animated-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="font-weight-bold text-white mb-0">Repair Requests Database</h5>
            <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={handleOpenAdd}>
              <FiAlertCircle />
              <span>Report Breakdown</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Priority</th>
                  <th>Date Requested</th>
                  <th>Reported By</th>
                  <th>Problem Details</th>
                  <th>Status</th>
                  <th>Expense</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {repairs.length > 0 ? (
                  repairs.map((r) => (
                    <tr key={r.id}>
                      <td className="font-weight-bold text-white">{r.Asset?.name}</td>
                      <td>
                        <span className={`badge bg-dark text-uppercase small border ${r.priority === 'Critical' ? 'border-danger text-danger' : r.priority === 'High' ? 'border-warning text-warning' : 'border-secondary text-secondary'}`}>
                          {r.priority}
                        </span>
                      </td>
                      <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                      <td>{r.Requester?.name}</td>
                      <td className="small text-white-50">{r.description}</td>
                      <td>
                        <span className={`badge badge-custom badge-${r.status === 'Completed' ? 'available' : r.status === 'In Progress' ? 'assigned' : r.status === 'Pending' ? 'maintenance' : 'retired'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="font-weight-bold text-success">${r.cost}</td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end gap-2">
                          {hasRole(['Admin', 'Technician']) && r.status === 'Pending' && (
                            <button className="btn btn-outline-custom btn-sm py-1 px-2" onClick={() => handleSetInProgress(r.id)}>
                              <span>Start Fix</span>
                            </button>
                          )}
                          {hasRole(['Admin', 'Technician']) && (r.status === 'Pending' || r.status === 'In Progress') && (
                            <button className="btn btn-outline-custom btn-sm py-1 px-2 text-success" onClick={() => handleOpenResolve(r)}>
                              <FiCheckSquare className="me-1" />
                              <span>Resolve</span>
                            </button>
                          )}
                          {r.status === 'Completed' && (
                            <span className="text-muted small">Fixed on {r.completedDate ? new Date(r.completedDate).toLocaleDateString() : '—'}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">No repair tickets active.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>Report Asset Malfunction / Breakdown</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreate}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Asset Target</Form.Label>
                <Form.Select value={formAssetId} onChange={(e) => setFormAssetId(e.target.value)} required>
                  <option value="">Select Asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Priority Severity</Form.Label>
                <Form.Select value={formPriority} onChange={(e) => setFormPriority(e.target.value)}>
                  <option value="Low">Low (General inquiry)</option>
                  <option value="Medium">Medium (Functional wear)</option>
                  <option value="High">High (Inoperable item)</option>
                  <option value="Critical">Critical (Halts department production)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Malfunction / Problem Details</Form.Label>
                <Form.Control as="textarea" rows={3} value={formDesc} onChange={(e) => setFormDesc(e.target.value)} placeholder="Describe symptoms, error screens, or physical breakage..." required />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Dispatch Ticket
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Resolve Modal */}
        <Modal show={showResolveModal} onHide={() => setShowResolveModal(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>Resolve Repair Ticket</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleResolve}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Action Resolution Status</Form.Label>
                <Form.Select value={resolveStatus} onChange={(e) => setResolveStatus(e.target.value)}>
                  <option value="Completed">Completed (Asset Fixed & Restored)</option>
                  <option value="Rejected">Rejected (Not a bug / Wear is negligible)</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Final Repair Cost ($)</Form.Label>
                <Form.Control type="number" step="0.01" value={resolveCost} onChange={(e) => setResolveCost(e.target.value)} placeholder="e.g. Parts cost, labor cost..." />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Resolution Comments</Form.Label>
                <Form.Control as="textarea" rows={3} value={resolveNotes} onChange={(e) => setResolveNotes(e.target.value)} placeholder="What was replaced or fixed..." />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowResolveModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Submit Resolution
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default Repairs;
