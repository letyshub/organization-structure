import React from 'react';

interface OrgNode {
  id: string;
  firstName: string;
  lastName: string;
  position?: { name: string };
  children: OrgNode[];
}

interface OrgChartProps {
  users: any[];
}

const OrgChart: React.FC<OrgChartProps> = ({ users }) => {
  // Transform flat list to tree structure
  const buildTree = (managerId: string | null): OrgNode[] => {
    return users
      .filter((u) => u.managerId === managerId)
      .map((u) => ({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        position: u.position,
        children: buildTree(u.id),
      }));
  };

  const tree = buildTree(null); // Assuming CEO has null managerId

  const renderNode = (node: OrgNode) => (
    <div key={node.id} className="org-node-container">
      <div className="org-node card" style={{ padding: '0.75rem', textAlign: 'center', minWidth: '150px' }}>
        <strong style={{ display: 'block' }}>{node.firstName} {node.lastName}</strong>
        <small style={{ color: 'var(--secondary)' }}>{node.position?.name || 'No Position'}</small>
      </div>
      {node.children.length > 0 && (
        <div className="org-children" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem', position: 'relative' }}>
          {node.children.map(renderNode)}
        </div>
      )}
    </div>
  );

  return (
    <div className="org-chart-wrapper" style={{ overflowX: 'auto', padding: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {tree.length > 0 ? tree.map(renderNode) : <p>No organizational structure defined.</p>}
      </div>
      <style>{`
        .org-node-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }
        .org-children::before {
          content: '';
          position: absolute;
          top: -0.75rem;
          left: 50%;
          width: 2px;
          height: 0.75rem;
          background: var(--border);
        }
      `}</style>
    </div>
  );
};

export default OrgChart;
