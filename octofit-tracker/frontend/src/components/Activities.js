import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import DataTable from './common/DataTable';
import AddItemModal from './common/AddItemModal';

const codespace = process.env.REACT_APP_CODESPACE_NAME;
const BASE = codespace ? `https://${codespace}-8000.app.github.dev/api/activities/` : 'http://localhost:8000/api/activities/';

export default function Activities() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('[Activities] Fetching from', BASE);
    fetch(BASE)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(json => {
        const normalized = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : []);
        console.log('[Activities] Raw response:', json);
        console.log('[Activities] Normalized data:', normalized);
        setData(normalized);
      })
      .catch(err => {
        console.error('[Activities] Error:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', header: 'Name', render: row => row.name || row.title || 'Activity' },
    { key: 'id', header: 'ID', render: row => row.id || '—', width: '120px' }
  ];

  const handleAdd = (formData) => {
    // Placeholder local append; real implementation would POST to API.
    setData(prev => [...prev, { id: Date.now(), name: formData.name }]);
  };

  if (loading) return <div className="container py-4"><h4>Activities</h4><p>Loading...</p></div>;
  if (error) return <div className="container py-4"><h4>Activities</h4><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="table-card-header">
          <h5 className="mb-0">Activities</h5>
          <Button size="sm" className="add-btn" onClick={() => setShowModal(true)}>Add Activity</Button>
        </Card.Header>
        <Card.Body>
          <DataTable columns={columns} data={data} emptyMessage="No activities found." />
        </Card.Body>
      </Card>
      <AddItemModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Add Activity"
        fields={[{ name: 'name', label: 'Activity Name', required: true, placeholder: 'Morning Run' }]}
        onSubmit={handleAdd}
      />
    </div>
  );
}
