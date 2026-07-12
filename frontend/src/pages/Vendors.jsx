import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Vendors = () => {
  const { hasRole } = useContext(AuthContext);
  const [vendors, setVendors] = useState([]);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const fetchVendors = async () => {
    try {
      const response = await api.get('/vendors');
      setVendors(response.data);
    } catch (error) {
      toast.error('Error loading vendors list');
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedVendor(null);
    setName('');
    setContactName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setShowModal(true);
  };

  const handleOpenEdit = (vendor) => {
    setIsEditing(true);
    setSelectedVendor(vendor);
    setName(vendor.name);
    setContactName(vendor.contactName || '');
    setEmail(vendor.email || '');
    setPhone(vendor.phone || '');
    setAddress(vendor.address || '');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error('Vendor name is required');
      return;
    }

    const payload = { name, contactName, email, phone, address };
    try {
      if (isEditing) {
        await api.put(`/vendors/${selectedVendor.id}`, payload);
        toast.success('Vendor record updated');
      } else {
        await api.post('/vendors', payload);
        toast.success('Vendor registered successfully');
      }
      setShowModal(false);
      fetchVendors();
    } catch (error) {
      toast.error('Error saving vendor record');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this vendor? This action is permanent.')) {
      try {
        await api.delete(`/vendors/${id}`);
        toast.success('Vendor deleted successfully');
        fetchVendors();
      } catch (error) {
        toast.error('Error deleting vendor');
      }
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Supplier Vendors Directory" />

        <div className="glass-card p-4 mt-4 animated-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="font-weight-bold text-white mb-0">Vendors Directory</h5>
            {hasRole(['Admin', 'Manager']) && (
              <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={handleOpenAdd}>
                <FiPlus />
                <span>Add Vendor</span>
              </button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Vendor Name</th>
                  <th>Primary Contact</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>HQ Location</th>
                  {hasRole(['Admin', 'Manager']) && <th className="text-end">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {vendors.length > 0 ? (
                  vendors.map((v) => (
                    <tr key={v.id}>
                      <td className="font-weight-bold text-white">{v.name}</td>
                      <td>{v.contactName || '—'}</td>
                      <td>{v.email ? <a href={`mailto:${v.email}`} className="text-decoration-none text-info d-flex align-items-center gap-1"><FiMail /> {v.email}</a> : '—'}</td>
                      <td>{v.phone ? <span className="d-flex align-items-center gap-1"><FiPhone /> {v.phone}</span> : '—'}</td>
                      <td>{v.address ? <span className="small text-white-50 text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={v.address}><FiMapPin /> {v.address}</span> : '—'}</td>
                      {hasRole(['Admin', 'Manager']) && (
                        <td className="text-end">
                          <div className="d-flex justify-content-end gap-2">
                            <button className="btn btn-outline-custom p-2" title="Edit Vendor" onClick={() => handleOpenEdit(v)}>
                              <FiEdit />
                            </button>
                            {hasRole(['Admin']) && (
                              <button className="btn btn-outline-custom p-2 text-danger" title="Delete Vendor" onClick={() => handleDelete(v.id)}>
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">No vendors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>{isEditing ? 'Modify Vendor Profile' : 'Register Supplier Vendor'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Company Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Contact Representative Name</Form.Label>
                <Form.Control type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Sales Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Contact Phone</Form.Label>
                <Form.Control type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Office / HQ Address</Form.Label>
                <Form.Control as="textarea" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Save Vendor
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default Vendors;
