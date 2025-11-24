import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import DataTable from './common/DataTable';
import AddItemModal from './common/AddItemModal';

const codespace = process.env.REACT_APP_CODESPACE_NAME;
const BASE = codespace ? `https://${codespace}-8000.app.github.dev/api/teams/` : 'http://localhost:8000/api/teams/';

export default function Teams() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('[Teams] Fetching from', BASE);
    fetch(BASE)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        const normalized = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : []);
        console.log('[Teams] Raw response:', json);
        console.log('[Teams] Normalized data:', normalized);
        setData(normalized);
      })
      .catch(err => { console.error('[Teams] Error:', err); setError(err.message); })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', header: 'Team Name', render: row => row.name || 'Team' },
    { key: 'members', header: 'Members', render: row => (row.members ? row.members.length : 0), width: '140px' }
  ];

  const handleAdd = (formData) => {
    setData(prev => [...prev, { id: Date.now(), name: formData.name, members: [] }]);
  };

  if (loading) return <div className="container py-4"><h4>Teams</h4><p>Loading...</p></div>;
  if (error) return <div className="container py-4"><h4>Teams</h4><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="table-card-header">
          <h5 className="mb-0">Teams</h5>
          <Button size="sm" className="add-btn" onClick={() => setShowModal(true)}>Add Team</Button>
        </Card.Header>
        <Card.Body>
          <DataTable columns={columns} data={data} emptyMessage="No teams found." />
        </Card.Body>
      </Card>
      <AddItemModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Add Team"
        fields={[{ name: 'name', label: 'Team Name', required: true, placeholder: 'Core Developers' }]}
        onSubmit={handleAdd}
      />
    </div>
  );
}
