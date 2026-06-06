import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserCard from './UserCard';
import React from 'react';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    position: { name: 'Developer' },
    team: { name: 'Engineering' }
  };

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} onClick={() => {}} />);
    
    expect(screen.getByText('John Doe')).toBeDefined();
    expect(screen.getByText('Developer')).toBeDefined();
    expect(screen.getByText('Engineering')).toBeDefined();
  });

  it('shows action buttons when onEdit/onDelete are provided', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    
    render(<UserCard user={mockUser} onClick={() => {}} onEdit={onEdit} onDelete={onDelete} />);
    
    expect(screen.getByText('Edit')).toBeDefined();
    expect(screen.getByText('Delete')).toBeDefined();
  });
});
