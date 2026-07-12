import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ title }) => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar top-navbar navbar-expand navbar-dark">
      <div className="container-fluid px-0">
        <h4 className="mb-0 font-weight-bold text-white">{title || 'Dashboard'}</h4>
        
        <div className="collapse navbar-collapse justify-content-end">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-custom p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
              <FiBell />
            </button>
            
            <div className="d-flex align-items-center gap-2">
              <div className="avatar-circle bg-primary d-flex align-items-center justify-content-center text-white rounded-circle font-weight-bold" style={{ width: '40px', height: '40px', background: 'var(--primary-grad)' }}>
                {user ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="d-none d-md-block">
                <div className="small font-weight-bold text-white">{user ? user.name : 'Guest'}</div>
                <div className="small text-muted" style={{ fontSize: '0.75rem' }}>{user ? user.email : ''}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
