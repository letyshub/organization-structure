import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import UserEditor from './pages/UserEditor';
import './styles/App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <AdminPanel />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users/new" element={
            <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
              <Layout>
                <UserEditor />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users/edit/:id" element={
            <ProtectedRoute roles={['ADMIN', 'EDITOR']}>
              <Layout>
                <UserEditor />
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
