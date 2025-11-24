import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function AddItemModal({ show, onHide, title, fields, onSubmit }) {
  const [formData, setFormData] = useState(() => {
    const init = {};
    fields.forEach(f => { init[f.name] = f.defaultValue || ''; });
    return init;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {fields.map(f => (
            <Form.Group key={f.name} className="mb-3">
              <Form.Label>{f.label}</Form.Label>
              <Form.Control
                name={f.name}
                value={formData[f.name]}
                onChange={handleChange}
                type={f.type || 'text'}
                placeholder={f.placeholder || ''}
                required={f.required}
              />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}