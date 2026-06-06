import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel: React.FC = () => {
  const [positions, setPositions] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [newName, setNewName] = useState({ position: '', team: '' });
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const fetchData = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        fetch(`${API_URL}/api/positions`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      if (pRes.ok && tRes.ok) {
        setPositions(await pRes.json());
        setTeams(await tRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (type: 'position' | 'team') => {
    const name = type === 'position' ? newName.position : newName.team;
    if (!name) return;

    try {
      const res = await fetch(`${API_URL}/api/${type}s`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        setNewName({ ...newName, [type]: '' });
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (type: 'position' | 'team', id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      const res = await fetch(`${API_URL}/api/${type}s/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading admin data...</p>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
      <section>
        <h2 style={{ marginBottom: '1rem' }}>Manage Positions</h2>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              placeholder="New Position Name (e.g. CTO)" 
              value={newName.position} 
              onChange={e => setNewName({ ...newName, position: e.target.value })} 
            />
            <button onClick={() => handleCreate('position')}>Add</button>
          </div>
        </div>
        <div className="card">
          <ul style={{ listStyle: 'none' }}>
            {positions.map(p => (
              <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                {p.name}
                <button 
                  onClick={() => handleDelete('position', p.id)} 
                  style={{ background: 'none', color: 'var(--error)', padding: 0 }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1rem' }}>Manage Teams</h2>
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              placeholder="New Team Name" 
              value={newName.team} 
              onChange={e => setNewName({ ...newName, team: e.target.value })} 
            />
            <button onClick={() => handleCreate('team')}>Add</button>
          </div>
        </div>
        <div className="card">
          <ul style={{ listStyle: 'none' }}>
            {teams.map(t => (
              <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                {t.name}
                <button 
                  onClick={() => handleDelete('team', t.id)} 
                  style={{ background: 'none', color: 'var(--error)', padding: 0 }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
