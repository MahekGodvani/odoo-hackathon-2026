import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { FiFileText, FiDownload, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Reports = () => {
  const { user } = useContext(AuthContext);

  const handleDownload = (format) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Session expired, please log in.');
      return;
    }
    
    // Direct link trigger with token as query param, or we can use axios to get file blob and download it.
    // Axios blob download is much more secure and supports custom headers (like Authorization token)!
    // Let's implement the secure Axios blob download:
    const fetchBlob = async () => {
      toast.loading(`Compiling ${format.toUpperCase()} report...`, { id: 'report' });
      try {
        const response = await api.get(`/reports/export/${format}`, {
          responseType: 'blob',
        });
        
        const blob = new Blob([response.data], {
          type: format === 'excel' 
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
            : 'application/pdf'
        });
        
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `assetflow_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`${format.toUpperCase()} report downloaded!`, { id: 'report' });
      } catch (error) {
        console.error(error);
        toast.error(`Error compiling ${format} report`, { id: 'report' });
      }
    };
    
    fetchBlob();
  };

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main-content flex-grow-1">
        <Navbar title="Inventory Audits & Exports" />

        <div className="row mt-4 g-4 animated-fade-in">
          {/* Card 1: Excel */}
          <div className="col-12 col-md-6">
            <div className="glass-card p-4 d-flex flex-column align-items-start gap-3 h-100">
              <div className="p-3 rounded-circle" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '2rem' }}>
                <FiFileText />
              </div>
              <h5 className="font-weight-bold text-white mb-1">Raw Excel Spreadsheet</h5>
              <p className="text-white-50 small">
                Downloads a detailed spreadsheet (`.xlsx`) containing all database asset profiles, categories, serial numbers, conditions, and acquisition cost centers. Best for pivot tables and manual adjustments.
              </p>
              <button className="btn btn-primary-grad mt-auto w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => handleDownload('excel')}>
                <FiDownload />
                <span>Download Excel Sheet</span>
              </button>
            </div>
          </div>

          {/* Card 2: PDF */}
          <div className="col-12 col-md-6">
            <div className="glass-card p-4 d-flex flex-column align-items-start gap-3 h-100">
              <div className="p-3 rounded-circle" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', fontSize: '2rem' }}>
                <FiFileText />
              </div>
              <h5 className="font-weight-bold text-white mb-1">Corporate PDF Ledger</h5>
              <p className="text-white-50 small">
                Generates a clean grid invoice-style inventory report formatted for letter printout. Displays IDs, serial keys, category classifications, departments, and active statuses. Best for physical handovers and executive briefs.
              </p>
              <button className="btn btn-primary-grad mt-auto w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => handleDownload('pdf')}>
                <FiDownload />
                <span>Download PDF Book</span>
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 mt-4 animated-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="d-flex align-items-center gap-3">
            <FiInfo style={{ fontSize: '1.5rem', color: 'var(--accent-color)' }} />
            <div>
              <h6 className="font-weight-bold text-white mb-1">Relational Auditing Info</h6>
              <div className="text-muted small">
                AssetFlow aggregates data in real-time. Exported files reflect the instantaneous snapshots of assignments, warranty checkmarks, and maintenance records currently active.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// Import helper (api) directly inside
import api from '../services/api';

export default Reports;
