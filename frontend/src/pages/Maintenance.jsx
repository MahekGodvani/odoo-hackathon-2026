import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Modal, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { FiCalendar, FiPlus, FiCheckSquare, FiTool } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const { hasRole } = useContext(AuthContext);
  
  const [schedules, setSchedules] = useState([]);
  const [records, setRecords] = useState([]);
  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Form states (Schedule)
  const [schedAssetId, setSchedAssetId] = useState('');
  const [schedTitle, setSchedTitle] = useState('');
  const [schedDesc, setSchedDesc] = useState('');
  const [schedFreq, setSchedFreq] = useState('Monthly');
  const [schedDate, setSchedDate] = useState('');
  const [schedTechId, setSchedTechId] = useState('');

  // Form states (Record / Log)
  const [recAssetId, setRecAssetId] = useState('');
  const [recSchedId, setRecSchedId] = useState('');
  const [recDesc, setRecDesc] = useState('');
  const [recCost, setRecCost] = useState('');
  const [recStatus, setRecStatus] = useState('Completed');
  const [recNotes, setRecNotes] = useState('');

  const fetchData = async () => {
    try {
      const [schedsRes, recsRes] = await Promise.all([
        api.get('/maintenance/schedules'),
        api.get('/maintenance/records')
      ]);
      setSchedules(schedsRes.data);
      setRecords(recsRes.data);
    } catch (error) {
      console.error(error);
      toast.error('Error loading maintenance logs');
    }
  };

  const fetchMetadata = async () => {
    try {
      const [assetsRes, usersRes] = await Promise.all([
        api.get('/assets', { params: { limit: 100 } }),
        api.get('/users')
      ]);
      setAssets(assetsRes.data.assets);
      // Filter technicians (role === 'Technician' or 'Admin')
      const techs = usersRes.data.filter(u => u.Role?.name === 'Technician' || u.Role?.name === 'Admin');
      setTechnicians(techs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMetadata();
  }, []);

  const handleOpenSchedule = () => {
    setSchedAssetId('');
    setSchedTitle('');
    setSchedDesc('');
    setSchedFreq('Monthly');
    setSchedDate('');
    setSchedTechId('');
    setShowScheduleModal(true);
  };

  const handleOpenRecord = (schedule = null) => {
    if (schedule) {
      setRecAssetId(schedule.assetId);
      setRecSchedId(schedule.id);
      setRecDesc(`Routine maintenance based on schedule: ${schedule.title}`);
    } else {
      setRecAssetId('');
      setRecSchedId('');
      setRecDesc('');
    }
    setRecCost('');
    setRecStatus('Completed');
    setRecNotes('');
    setShowRecordModal(true);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!schedAssetId || !schedTitle || !schedDate) {
      toast.error('Asset, title, and due date are required');
      return;
    }

    try {
      await api.post('/maintenance/schedules', {
        assetId: parseInt(schedAssetId),
        title: schedTitle,
        description: schedDesc,
        frequency: schedFreq,
        nextDueDate: schedDate,
        assignedTechnicianId: schedTechId ? parseInt(schedTechId) : null,
      });
      toast.success('Maintenance schedule successfully created');
      setShowScheduleModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error creating maintenance schedule');
    }
  };

  const handleCreateRecord = async (e) => {
    e.preventDefault();
    if (!recAssetId || !recDesc) {
      toast.error('Asset and service description are required');
      return;
    }

    try {
      await api.post('/maintenance/records', {
        assetId: parseInt(recAssetId),
        maintenanceScheduleId: recSchedId ? parseInt(recSchedId) : null,
        description: recDesc,
        cost: recCost ? parseFloat(recCost) : 0.00,
        status: recStatus,
        notes: recNotes,
      });
      toast.success('Maintenance record logged successfully');
      setShowRecordModal(false);
      fetchData();
    } catch (error) {
      toast.error('Error logging maintenance record');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Asset Maintenance & Service" />

        <div className="mt-4 animated-fade-in">
          <Tabs defaultActiveKey="schedules" id="maintenance-tab-control" className="mb-3" variant="pills">
            {/* Schedules Tab */}
            <Tab eventKey="schedules" title="Schedules Calendars">
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="font-weight-bold text-white mb-0">Scheduled Tasks</h5>
                  {hasRole(['Admin', 'Manager']) && (
                    <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={handleOpenSchedule}>
                      <FiCalendar />
                      <span>Schedule Maintenance</span>
                    </button>
                  )}
                </div>

                <div className="table-responsive">
                  <table className="table table-custom">
                    <thead>
                      <tr>
                        <th>Asset Name</th>
                        <th>Task Name</th>
                        <th>Frequency</th>
                        <th>Next Due Date</th>
                        <th>Technician</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedules.length > 0 ? (
                        schedules.map((s) => (
                          <tr key={s.id}>
                            <td className="font-weight-bold text-white">{s.Asset?.name}</td>
                            <td>{s.title}</td>
                            <td>{s.frequency}</td>
                            <td>{new Date(s.nextDueDate).toLocaleDateString()}</td>
                            <td>{s.Technician?.name || 'Unassigned'}</td>
                            <td className="text-end">
                              {hasRole(['Admin', 'Technician']) && (
                                <button className="btn btn-outline-custom btn-sm py-1 px-2 d-inline-flex align-items-center gap-1 text-success" onClick={() => handleOpenRecord(s)}>
                                  <FiCheckSquare />
                                  <span>Log Complete</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">No maintenance routines scheduled.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab>

            {/* Records Tab */}
            <Tab eventKey="records" title="Service Logs Database">
              <div className="glass-card p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="font-weight-bold text-white mb-0">Completed Service Database</h5>
                  {hasRole(['Admin', 'Technician']) && (
                    <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={() => handleOpenRecord(null)}>
                      <FiPlus />
                      <span>Log Ad-hoc Service</span>
                    </button>
                  )}
                </div>

                <div className="table-responsive">
                  <table className="table table-custom">
                    <thead>
                      <tr>
                        <th>Asset Name</th>
                        <th>Performed By</th>
                        <th>Performed Date</th>
                        <th>Cost</th>
                        <th>Service Description</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.length > 0 ? (
                        records.map((r) => (
                          <tr key={r.id}>
                            <td className="font-weight-bold text-white">{r.Asset?.name}</td>
                            <td>{r.Technician?.name || 'Staff'}</td>
                            <td>{new Date(r.performedDate).toLocaleDateString()}</td>
                            <td className="font-weight-bold text-success">${r.cost}</td>
                            <td>{r.description}</td>
                            <td>
                              <span className={`badge badge-custom badge-${r.status === 'Completed' ? 'available' : 'maintenance'}`}>{r.status}</span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-muted">No completed service logs.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Schedule Modal */}
        <Modal show={showScheduleModal} onHide={() => setShowScheduleModal(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>Schedule Preventative Maintenance</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateSchedule}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Asset target</Form.Label>
                <Form.Select value={schedAssetId} onChange={(e) => setSchedAssetId(e.target.value)} required>
                  <option value="">Select Asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Task Action Name</Form.Label>
                <Form.Control type="text" placeholder="e.g. Annual OS upgrade, Air filter replacement" value={schedTitle} onChange={(e) => setSchedTitle(e.target.value)} required />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Frequency</Form.Label>
                <Form.Select value={schedFreq} onChange={(e) => setSchedFreq(e.target.value)}>
                  <option value="One-time">One-time</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Bi-annually">Bi-annually</option>
                  <option value="Annually">Annually</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Next Due Date</Form.Label>
                <Form.Control type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} required />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Assign Tech Specialist</Form.Label>
                <Form.Select value={schedTechId} onChange={(e) => setSchedTechId(e.target.value)}>
                  <option value="">Choose Technician...</option>
                  {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Detailed description</Form.Label>
                <Form.Control as="textarea" rows={2} value={schedDesc} onChange={(e) => setSchedDesc(e.target.value)} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Save Schedule
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Record/Log Service Modal */}
        <Modal show={showRecordModal} onHide={() => setShowRecordModal(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>Log Service Record</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleCreateRecord}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Asset Serviced</Form.Label>
                <Form.Select value={recAssetId} onChange={(e) => setRecAssetId(e.target.value)} disabled={!!recSchedId} required>
                  <option value="">Select Asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>)}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Service Performed Description</Form.Label>
                <Form.Control type="text" placeholder="e.g. Cleared fans dust, replaced memory stick" value={recDesc} onChange={(e) => setRecDesc(e.target.value)} required />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Total Expenses Incurred ($)</Form.Label>
                <Form.Control type="number" step="0.01" placeholder="0.00" value={recCost} onChange={(e) => setRecCost(e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Job Status</Form.Label>
                <Form.Select value={recStatus} onChange={(e) => setRecStatus(e.target.value)}>
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Additional notes / findings</Form.Label>
                <Form.Control as="textarea" rows={2} value={recNotes} onChange={(e) => setRecNotes(e.target.value)} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowRecordModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Save Record
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default Maintenance;
