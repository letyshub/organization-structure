import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserEditor: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'READER',
    firstName: '',
    lastName: '',
    sex: 'Male',
    dateOfBirth: '',
    address: '',
    positionId: '',
    teamId: '',
    managerId: ''
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const [positions, setPositions] = useState([]);
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, tRes, uRes] = await Promise.all([
          fetch(`${API_URL}/api/positions`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/users`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        setPositions(await pRes.json());
        setTeams(await tRes.json());
        setUsers(await uRes.json());

        if (id) {
          const userRes = await fetch(`${API_URL}/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userData = await userRes.json();
          setFormData({
            ...userData,
            password: '', 
            dateOfBirth: userData.dateOfBirth.split('T')[0],
            positionId: userData.positionId || '',
            teamId: userData.teamId || '',
            managerId: userData.managerId || ''
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/api/users/${id}` : `${API_URL}/api/users`;

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      const value = (formData as any)[key];
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });
    if (photo) {
      data.append('photo', photo);
    }

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
          // Don't set Content-Type, fetch will set it for FormData
        },
        body: data
      });
      if (res.ok) navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>{id ? 'Edit User' : 'Create New User'}</h2>
      <form onSubmit={handleSubmit} className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Email</label>
          <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        {!id && (
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
          </div>
        )}
        <div>
          <label>First Name</label>
          <input type="text" value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} required />
        </div>
        <div>
          <label>Last Name</label>
          <input type="text" value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} required />
        </div>
        <div>
          <label>Role</label>
          <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value as any })}>
            <option value="READER">Reader</option>
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label>Sex</label>
          <select value={formData.sex} onChange={e => setFormData({ ...formData, sex: e.target.value })}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input type="date" value={formData.dateOfBirth} onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} required />
        </div>
        <div>
          <label>Address</label>
          <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Photo</label>
          <input type="file" accept="image/*" onChange={e => setPhoto(e.target.files ? e.target.files[0] : null)} />
        </div>
        <div>
          <label>Position</label>
          <select value={formData.positionId} onChange={e => setFormData({ ...formData, positionId: e.target.value })}>
            <option value="">None</option>
            {positions.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label>Team</label>
          <select value={formData.teamId} onChange={e => setFormData({ ...formData, teamId: e.target.value })}>
            <option value="">None</option>
            {teams.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label>Reports To (Manager)</label>
          <select value={formData.managerId} onChange={e => setFormData({ ...formData, managerId: e.target.value })}>
            <option value="">None (CEO)</option>
            {users.filter((u: any) => u.id !== id).map((u: any) => (
              <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1', marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button type="submit" style={{ flex: 1 }}>{id ? 'Update User' : 'Create User'}</button>
          <button type="button" onClick={() => navigate('/')} style={{ flex: 1, background: 'var(--secondary)' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserEditor;
