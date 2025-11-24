import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import DataTable from './common/DataTable';
import AddItemModal from './common/AddItemModal';

const codespace = process.env.REACT_APP_CODESPACE_NAME;
const BASE = codespace ? `https://${codespace}-8000.app.github.dev/api/users/` : 'http://localhost:8000/api/users/';

export default function Users() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('[Users] Fetching from', BASE);
    fetch(BASE)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        const normalized = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : []);
        console.log('[Users] Raw response:', json);
        console.log('[Users] Normalized data:', normalized);
        setData(normalized);
      })
      .catch(err => { console.error('[Users] Error:', err); setError(err.message); })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'username', header: 'Username', render: row => row.username || row.email || 'User' },
    { key: 'email', header: 'Email', render: row => row.email || '—' }
  ];

  const handleAdd = (formData) => {
    setData(prev => [...prev, { id: Date.now(), username: formData.username, email: formData.email }]);
  };

  if (loading) return <div className="container py-4"><h4>Users</h4><p>Loading...</p></div>;
  if (error) return <div className="container py-4"><h4>Users</h4><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="table-card-header">
          <h5 className="mb-0">Users</h5>
          <Button size="sm" className="add-btn" onClick={() => setShowModal(true)}>Add User</Button>
        </Card.Header>
        <Card.Body>
          <DataTable columns={columns} data={data} emptyMessage="No users found." />
        </Card.Body>
      </Card>
      <AddItemModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Add User"
        fields={[
          { name: 'username', label: 'Username', required: true, placeholder: 'octocat' },
          { name: 'email', label: 'Email', type: 'email', placeholder: 'octo@example.com' }
        ]}
        onSubmit={handleAdd}
      />
    </div>
  );
}
