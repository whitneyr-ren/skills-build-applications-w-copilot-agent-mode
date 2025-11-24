import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import DataTable from './common/DataTable';
import AddItemModal from './common/AddItemModal';

const codespace = process.env.REACT_APP_CODESPACE_NAME;
const BASE = codespace ? `https://${codespace}-8000.app.github.dev/api/leaderboard/` : 'http://localhost:8000/api/leaderboard/';

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('[Leaderboard] Fetching from', BASE);
    fetch(BASE)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        const normalized = Array.isArray(json) ? json : (Array.isArray(json.results) ? json.results : []);
        console.log('[Leaderboard] Raw response:', json);
        console.log('[Leaderboard] Normalized data:', normalized);
        setData(normalized);
      })
      .catch(err => { console.error('[Leaderboard] Error:', err); setError(err.message); })
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'user', header: 'User', render: row => row.user || row.name || 'User' },
    { key: 'score', header: 'Score', render: row => row.score || row.points || 0, width: '140px' }
  ];

  const handleAdd = (formData) => {
    setData(prev => [...prev, { id: Date.now(), user: formData.user, score: Number(formData.score) || 0 }]);
  };

  if (loading) return <div className="container py-4"><h4>Leaderboard</h4><p>Loading...</p></div>;
  if (error) return <div className="container py-4"><h4>Leaderboard</h4><p className="text-danger">Error: {error}</p></div>;

  return (
    <div className="container py-4">
      <Card className="shadow-sm">
        <Card.Header className="table-card-header">
          <h5 className="mb-0">Leaderboard</h5>
          <Button size="sm" className="add-btn" onClick={() => setShowModal(true)}>Add Entry</Button>
        </Card.Header>
        <Card.Body>
          <DataTable columns={columns} data={data} emptyMessage="No leaderboard entries." />
        </Card.Body>
      </Card>
      <AddItemModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Add Leaderboard Entry"
        fields={[
          { name: 'user', label: 'User', required: true, placeholder: 'octocat' },
          { name: 'score', label: 'Score', required: true, type: 'number', placeholder: '100' }
        ]}
        onSubmit={handleAdd}
      />
    </div>
  );
}
