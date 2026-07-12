import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Modal, Button, Form } from 'react-bootstrap';
import { FiPlus, FiEdit, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Users = () => {
  const [users, setUsers] = useState([]);
  
  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(4); // default to employee
  const [status, setStatus] = useState('active');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Error fetching system users list');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setRoleId(4);
    setStatus('active');
    setShowModal(true);
  };

  const handleOpenEdit = (user) => {
    setIsEditing(true);
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(''); // leave blank unless changing password
    setRoleId(user.roleId);
    setStatus(user.status);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Name and email are required');
      return;
    }

    if (!isEditing && !password) {
      toast.error('Password is required for new accounts');
      return;
    }

    const payload = {
      name,
      email,
      roleId: parseInt(roleId),
      status,
    };

    if (password) {
      payload.password = password;
    }

    try {
      if (isEditing) {
        await api.put(`/users/${selectedUser.id}`, payload);
        toast.success('User account profile modified');
      } else {
        await api.post('/users', payload);
        toast.success('Account created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error processing account save');
    }
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="User Accounts Administration" />

        <div className="glass-card p-4 mt-4 animated-fade-in">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="font-weight-bold text-white mb-0">System Users</h5>
            <button className="btn btn-primary-grad d-flex align-items-center gap-2" onClick={handleOpenAdd}>
              <FiPlus />
              <span>Create User</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>User Full Name</th>
                  <th>Email Address</th>
                  <th>Permission Role</th>
                  <th>Status</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="font-weight-bold text-white d-flex align-items-center gap-2">
                        <div className="avatar-circle bg-dark border border-color d-flex align-items-center justify-content-center text-white-50 rounded-circle" style={{ width: '32px', height: '32px' }}>
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className="d-inline-flex align-items-center gap-1">
                          <FiShield className="text-primary" />
                          <strong>{u.Role?.name || 'Employee'}</strong>
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-dark small border ${u.status === 'active' ? 'border-success text-success' : 'border-danger text-danger'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button className="btn btn-outline-custom p-2" title="Edit User Credentials" onClick={() => handleOpenEdit(u)}>
                          <FiEdit />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Account Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="glass-card text-white">
          <Modal.Header closeButton closeVariant="white" className="border-color">
            <Modal.Title>{isEditing ? 'Modify Account Details' : 'Register New User Account'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSave}>
            <Modal.Body className="d-flex flex-column gap-3">
              <Form.Group>
                <Form.Label className="small text-muted">Full Name</Form.Label>
                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Email Address</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">{isEditing ? 'New Password (leave blank to keep unchanged)' : 'Initial Password'}</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required={!isEditing} />
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Permission Role</Form.Label>
                <Form.Select value={roleId} onChange={(e) => setRoleId(e.target.value)}>
                  <option value={1}>Admin</option>
                  <option value={2}>Manager</option>
                  <option value={3}>Technician</option>
                  <option value={4}>Employee</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label className="small text-muted">Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer className="border-color">
              <Button variant="outline-light" className="btn-outline-custom" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" className="btn-primary-grad">
                Save User
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </div>
    </div>
  );
};

export default Users;
