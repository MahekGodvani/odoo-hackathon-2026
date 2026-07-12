import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Form, Button } from 'react-bootstrap';
import { FiSave, FiSettings } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Settings = () => {
  const [companyName, setCompanyName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setCompanyName(response.data.company_name || '');
      setCurrency(response.data.currency || 'USD');
    } catch (error) {
      toast.error('Error fetching system configurations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings', {
        company_name: companyName,
        currency: currency,
      });
      toast.success('Configuration profiles saved!');
      fetchSettings();
    } catch (error) {
      toast.error('Error updating system configurations');
    }
  };

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', background: 'var(--bg-app)' }}>
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="System Configurations Settings" />

        <div className="glass-card p-4 mt-4 animated-fade-in" style={{ maxWidth: '600px' }}>
          <div className="d-flex align-items-center gap-2 mb-4">
            <FiSettings className="text-primary" style={{ fontSize: '1.5rem' }} />
            <h5 className="font-weight-bold text-white mb-0">General Configurations</h5>
          </div>

          <Form onSubmit={handleSave} className="d-flex flex-column gap-3">
            <Form.Group>
              <Form.Label className="small text-muted">Company Name (Ledger Header)</Form.Label>
              <Form.Control 
                type="text" 
                value={companyName} 
                onChange={(e) => setCompanyName(e.target.value)} 
                required 
              />
              <Form.Text className="text-white-50 small">Appears on PDF reports headers.</Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label className="small text-muted">Global System Currency</Form.Label>
              <Form.Select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </Form.Select>
              <Form.Text className="text-white-50 small">Updates currency label throughout lists and metrics cards.</Form.Text>
            </Form.Group>

            <div className="mt-3">
              <Button type="submit" className="btn-primary-grad d-flex align-items-center gap-2">
                <FiSave />
                <span>Save Configurations</span>
              </Button>
            </div>
          </Form>
        </div>

      </div>
    </div>
  );
};

export default Settings;
