import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [loading, setLoading] = useState(true);
  const { token, user: currentUser } = useAuth();
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, positionsRes] = await Promise.all([
        fetch(`${API_URL}/api/users?name=${searchName}&positionId=${selectedPosition}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/positions`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (usersRes.ok && positionsRes.ok) {
        setUsers(await usersRes.json());
        setPositions(await positionsRes.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this person?')) return;
    try {
      const res = await fetch(`${API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchName, selectedPosition]);

  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'EDITOR';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Employee Directory</h2>
        {canEdit && (
          <button onClick={() => navigate('/users/new')}>+ Add Person</button>
        )}
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Search by Name</label>
          <input 
            type="text" 
            placeholder="First or Last name..." 
            value={searchName} 
            onChange={(e) => setSearchName(e.target.value)} 
          />
        </div>
        <div style={{ width: '250px' }}>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Position</label>
          <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)}>
            <option value="">All Positions</option>
            {positions.map((pos: any) => (
              <option key={pos.id} value={pos.id}>{pos.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading directory...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {users.length > 0 ? (
            users.map((user: any) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onEdit={canEdit ? (id) => navigate(`/users/edit/${id}`) : undefined}
                onDelete={canEdit ? handleDelete : undefined}
                onClick={(id) => navigate(`/users/edit/${id}`)} 
              />
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem 0', color: 'var(--secondary)' }}>No people found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
