import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiPlus, FiUserCheck, FiRepeat } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Modals state
  const [showCheckout, setShowCheckout] = useState(false);

  // Form state
  const [formAssetId, setFormAssetId] = useState('');
  const [formEmployeeId, setFormEmployeeId] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fetchAssignments = async () => {
    try {
      const response = await api.get('/assignments');
      setAssignments(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Error fetching assignments data');
    }
  };

  const fetchMetadata = async () => {
    try {
      // Get all users (employees)
      const usersRes = await api.get('/users');
      setEmployees(usersRes.data);

      // Get all assets, then filter available ones for checkout dropdown
      // For simple client-side search, or we query /assets?status=Available
      const assetsRes = await api.get('/assets', { params: { limit: 100 } });
      const available = assetsRes.data.assets.filter(a => a.status === 'Available');
      setAvailableAssets(available);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchMetadata();
  }, []);

  const handleOpenCheckout = () => {
    fetchMetadata(); // refresh latest available assets
    setFormAssetId('');
    setFormEmployeeId('');
    setFormNotes('');
    setShowCheckout(true);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!formAssetId || !formEmployeeId) {
      toast.error('Asset and employee selections are required');
      return;
    }

    try {
      await api.post('/assignments', {
        assetId: parseInt(formAssetId),
        employeeId: parseInt(formEmployeeId),
        notes: formNotes,
      });
      toast.success('Asset successfully checked out');
      setShowCheckout(false);
      fetchAssignments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing assignment');
    }
  };

  const handleReturn = async (id) => {
    try {
      await api.post(`/assignments/return`, { assignmentId: id });
      toast.success('Asset checked in successfully');
      fetchAssignments();
      fetchMetadata();
    } catch (error) {
      toast.error('Error checking in asset');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Asset Assignments" />

        <div className="glass-card p-4 mt-4 animated-fade-in">
          {/* Header Action */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="font-weight-bold text-white mb-0">Active Checkout Log</h5>
            <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={handleOpenCheckout}>
              <FiUserCheck />
              <span>Checkout Asset</span>
            </button>
          </div>

          {/* Assignments Table */}
          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Asset Code</th>
                  <th>Asset Name</th>
                  <th>Assigned To</th>
                  <th>Checkout Date</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.length > 0 ? (
                  assignments.map((asg) => (
                    <tr key={asg.id}>
                      <td><code className="text-white">{asg.Asset?.serialNumber || 'N/A'}</code></td>
                      <td className="font-weight-bold text-white">{asg.Asset?.name}</td>
                      <td>{asg.Employee?.name}</td>
                      <td>{new Date(asg.assignedDate).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-custom badge-${asg.status === 'Active' ? 'assigned' : 'available'}`}>
                          {asg.status}
                        </span>
                      </td>
                      <td className="small text-white-50">{asg.notes || '—'}</td>
                      <td className="text-end">
                        {asg.status === 'Active' && (
                          <button
                            className="btn btn-outline-custom p-2 btn-sm d-inline-flex align-items-center gap-1 text-success"
                            onClick={() => handleReturn(asg.id)}
                            title="Return Asset"
                          >
                            <FiRepeat />
                            <span>Return</span>
                          </button>
                        )}
                        {asg.status === 'Returned' && (
                          <span className="text-muted small">Returned on {new Date(asg.returnDate).toLocaleDateString()}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No assignments logged in the system</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Checkout Modal */}
        <Modal show={showCheckout} onHide={() => setShowCheckout(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>Assign & Checkout Asset</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCheckout}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Select Available Asset</Form.Label>
                <Form.Select value={formAssetId} onChange={(e) => setFormAssetId(e.target.value)} required>
                  <option value="">Choose Asset...</option>
                  {availableAssets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} (S/N: {a.serialNumber || 'N/A'})</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Assign To Employee</Form.Label>
                <Form.Select value={formEmployeeId} onChange={(e) => setFormEmployeeId(e.target.value)} required>
                  <option value="">Choose Employee...</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.Role?.name})</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Assignment Remarks / Notes</Form.Label>
                <Form.Control as="textarea" rows={3} value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="Condition details or usage details..." />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowCheckout(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Confirm Checkout
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default Assignments;
