import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '1rem' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none' }}>
            OrgStructure
          </Link>
          {user && (
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'var(--text)' }}>Dashboard</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" style={{ textDecoration: 'none', color: 'var(--text)' }}>Admin Panel</Link>
              )}
              <span style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{user.firstName} ({user.role})</span>
              <button onClick={handleLogout} style={{ background: 'none', color: 'var(--error)', border: 'none', padding: 0 }}>Logout</button>
            </div>
          )}
        </div>
      </nav>
      <main className="container" style={{ marginTop: '2rem' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
