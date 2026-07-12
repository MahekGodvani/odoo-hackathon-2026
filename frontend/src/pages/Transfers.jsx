import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiRepeat, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Transfers = () => {
  const [transfers, setTransfers] = useState([]);
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Modals state
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [formAssetId, setFormAssetId] = useState('');
  const [formToDeptId, setFormToDeptId] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fetchTransfers = async () => {
    try {
      const response = await api.get('/transfers');
      setTransfers(response.data);
    } catch (error) {
      toast.error('Error fetching department transfers log');
    }
  };

  const fetchMetadata = async () => {
    try {
      const [assetsRes, deptsRes] = await Promise.all([
        api.get('/assets', { params: { limit: 100 } }),
        api.get('/departments')
      ]);
      setAssets(assetsRes.data.assets);
      setDepartments(deptsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTransfers();
    fetchMetadata();
  }, []);

  const handleOpenTransfer = () => {
    fetchMetadata();
    setFormAssetId('');
    setFormToDeptId('');
    setFormNotes('');
    setShowModal(true);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!formAssetId || !formToDeptId) {
      toast.error('Asset and destination department are required');
      return;
    }

    try {
      await api.post('/transfers', {
        assetId: parseInt(formAssetId),
        toDepartmentId: parseInt(formToDeptId),
        notes: formNotes,
      });
      toast.success('Asset department transfer logged successfully');
      setShowModal(false);
      fetchTransfers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing department transfer');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Asset Department Transfers" />

        <div className="glass-card p-4 mt-4 animated-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="font-weight-bold text-white mb-0">Department Transfer Logs</h5>
            <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={handleOpenTransfer}>
              <FiRepeat />
              <span>Transfer Asset</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Asset Name</th>
                  <th>Origin Department</th>
                  <th>Destination Department</th>
                  <th>Transfer Date</th>
                  <th>Logged By</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {transfers.length > 0 ? (
                  transfers.map((t) => (
                    <tr key={t.id}>
                      <td className="font-weight-bold text-white">{t.Asset?.name}</td>
                      <td>{t.FromDepartment ? <span className="badge bg-dark border border-secondary">{t.FromDepartment.name}</span> : <span className="text-muted small">None</span>}</td>
                      <td><span className="badge badge-custom badge-assigned">{t.ToDepartment?.name}</span></td>
                      <td>{new Date(t.transferDate).toLocaleDateString()}</td>
                      <td>{t.Approver?.name || 'System'}</td>
                      <td>
                        <span className="badge badge-custom badge-available">{t.status}</span>
                      </td>
                      <td className="small text-white-50">{t.notes || '—'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-muted">No department transfers logged</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transfer Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>Transfer Asset Department Allocation</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleTransfer}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Asset Target</Form.Label>
                <Form.Select value={formAssetId} onChange={(e) => setFormAssetId(e.target.value)} required>
                  <option value="">Select Asset...</option>
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} (Current: {a.Department?.name || 'No department'})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Destination Department</Form.Label>
                <Form.Select value={formToDeptId} onChange={(e) => setFormToDeptId(e.target.value)} required>
                  <option value="">Select Destination...</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Transfer Reason / Remarks</Form.Label>
                <Form.Control as="textarea" rows={3} value={formNotes} onChange={(e) => setFormNotes(e.target.value)} placeholder="e.g. Budget re-allocation, project handover..." />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Execute Transfer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default Transfers;
