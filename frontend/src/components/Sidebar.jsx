import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/dashboard',         icon: '🏠', label: 'Dashboard',         roles: ['admin', 'staff'] },
  { to: '/admin/students',    icon: '👥', label: 'Student Data',      roles: ['admin'] },
  { to: '/admin/companies',   icon: '🏢', label: 'Post Companies',    roles: ['admin'] },
  
  { to: '/student/drives',    icon: '🏢', label: 'Placement Drives',   roles: ['student', 'admin'] },
  { to: '/predict',           icon: '🔮', label: 'Prediction',        roles: ['student'] },
];

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('pspa_token');
    localStorage.removeItem('pspa_user');
    if (onLogout) onLogout();
    navigate('/login');
  };

  const initials = user?.name ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) : 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">🎓</div>
        <div className="sidebar-brand-text">
          Mini Project
          <span>PSPA System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems
          .filter(item => item.roles.includes(user?.role || 'student'))
          .map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              style={item.highlight ? { background: 'rgba(99,179,237,0.15)', borderColor: 'rgba(99,179,237,0.3)' } : {}}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.highlight && <span style={{ marginLeft: 'auto', fontSize: 9, background: '#f59e0b', color: '#fff', padding: '1px 6px', borderRadius: 8, fontWeight: 700 }}>NEW</span>}
            </NavLink>
          ))}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div style={{ padding: '8px 14px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar" style={{ width: 30, height: 30, fontSize: 12 }}>{initials}</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{user.role}</div>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
