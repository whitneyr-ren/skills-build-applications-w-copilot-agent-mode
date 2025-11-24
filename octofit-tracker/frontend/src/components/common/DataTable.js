import React from 'react';
import { Table } from 'react-bootstrap';

export default function DataTable({ columns, data, emptyMessage }) {
  return (
    <div className="table-responsive">
      <Table striped bordered hover size="sm" className="align-middle">
        <thead className="table-light">
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width || 'auto' }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="text-center text-muted">
                {emptyMessage || 'No data available.'}
              </td>
            </tr>
          )}
          {data.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map(col => (
                <td key={col.key + (row.id || idx)}>
                  {typeof col.render === 'function' ? col.render(row, idx) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}