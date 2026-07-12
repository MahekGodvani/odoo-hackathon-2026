import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  FiLayers, 
  FiBox, 
  FiUser, 
  FiRepeat, 
  FiTool, 
  FiTruck, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiGrid
} from 'react-icons/fi';
import { FaWrench } from 'react-icons/fa';

const Sidebar = () => {
  const { user, logout, hasRole } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div className="sidebar-container">
      <div className="sidebar-brand">
        <FiLayers />
        <span>AssetFlow</span>
      </div>

      <div className="mb-3 px-3">
        <span className="badge badge-custom badge-assigned text-uppercase">{user.role}</span>
        <div className="small text-white-50 mt-1">{user.name}</div>
      </div>

      <ul className="sidebar-menu">
        <li className="sidebar-item">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            <FiGrid />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/assets" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiBox />
            <span>Assets</span>
          </NavLink>
        </li>

        {hasRole(['Admin', 'Manager']) && (
          <>
            <li className="sidebar-item">
              <NavLink to="/assignments" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiUser />
                <span>Assignments</span>
              </NavLink>
            </li>

            <li className="sidebar-item">
              <NavLink to="/transfers" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiRepeat />
                <span>Transfers</span>
              </NavLink>
            </li>
          </>
        )}

        <li className="sidebar-item">
          <NavLink to="/maintenance" className={({ isActive }) => isActive ? 'active' : ''}>
            <FiTool />
            <span>Maintenance</span>
          </NavLink>
        </li>

        <li className="sidebar-item">
          <NavLink to="/repairs" className={({ isActive }) => isActive ? 'active' : ''}>
            <FaWrench />
            <span>Repairs</span>
          </NavLink>
        </li>

        {hasRole(['Admin', 'Manager']) && (
          <>
            <li className="sidebar-item">
              <NavLink to="/vendors" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiTruck />
                <span>Vendors</span>
              </NavLink>
            </li>

            <li className="sidebar-item">
              <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiFileText />
                <span>Reports</span>
              </NavLink>
            </li>
          </>
        )}

        {hasRole(['Admin']) && (
          <>
            <li className="sidebar-item">
              <NavLink to="/users" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiUsers />
                <span>Users</span>
              </NavLink>
            </li>

            <li className="sidebar-item">
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiSettings />
                <span>Settings</span>
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div className="mt-auto">
        <button className="btn btn-outline-custom w-100 d-flex align-items-center justify-content-center gap-2" onClick={logout}>
          <FiLogOut />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
