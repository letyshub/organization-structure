import React from 'react';

interface UserCardProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position?: { name: string };
    team?: { name: string };
    photoUrl?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onClick: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick, onEdit, onDelete }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';
  const photoUrl = user.photoUrl ? (user.photoUrl.startsWith('http') ? user.photoUrl : `${API_URL}${user.photoUrl}`) : null;

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div onClick={() => onClick(user.id)} style={{ cursor: 'pointer', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {photoUrl ? (
            <img src={photoUrl} alt={`${user.firstName} ${user.lastName}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '1.5rem', color: '#64748b' }}>{user.firstName[0]}{user.lastName[0]}</span>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: '1.125rem' }}>{user.firstName} {user.lastName}</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{user.position?.name || 'No Position'}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>{user.team?.name || 'No Team'}</p>
        </div>
      </div>
      {(onEdit || onDelete) && (
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          {onEdit && (
            <button onClick={() => onEdit(user.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'var(--secondary)' }}>Edit</button>
          )}
          {onDelete && (
            <button onClick={() => onDelete(user.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', background: 'var(--error)' }}>Delete</button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
