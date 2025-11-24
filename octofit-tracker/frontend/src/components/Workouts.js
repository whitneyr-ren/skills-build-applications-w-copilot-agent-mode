import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import DataTable from './common/DataTable';
import AddItemModal from './common/AddItemModal';

const codespace = process.env.REACT_APP_CODESPACE_NAME;
const BASE = codespace ? `https://${codespace}-8000.app.github.dev/api/workouts/` : 'http://localhost:8000/api/workouts/';

export default function Workouts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('[Workouts] Fetching from', BASE);
    fetch(BASE)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        const normalized = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : []);
        console.log('[Workouts] Raw response:', json);
        console.log('[Workouts] Normalized data:', normalized);
        setData(normalized);
      })
      .catch(err => { console.error('[Workouts] Error:', err); setError(err.message); })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', header: 'Workout', render: row => row.name || row.title || 'Workout' },
    { key: 'id', header: 'ID', render: row => row.id || '—', width: '120px' }
  ];

  const handleAdd = (formData) => {
    setData(prev => [...prev, { id: Date.now(), name: formData.name }]);
  };

  if (loading) return <div className="container py-4"><h4>Workouts</h4><p>Loading...</p></div>;
  if (error) return <div className="container py-4"><h4>Workouts</h4><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="table-card-header">
          <h5 className="mb-0">Workouts</h5>
          <Button size="sm" className="add-btn" onClick={() => setShowModal(true)}>Add Workout</Button>
        </Card.Header>
        <Card.Body>
          <DataTable columns={columns} data={data} emptyMessage="No workouts found." />
        </Card.Body>
      </Card>
      <AddItemModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Add Workout"
        fields={[{ name: 'name', label: 'Workout Name', required: true, placeholder: 'Full Body Blast' }]}
        onSubmit={handleAdd}
      />
    </div>
  );
}
