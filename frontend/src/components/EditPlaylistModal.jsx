import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditPlaylistModal = ({ show, onHide, onSave, playlist }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    if (playlist) {
      setFormData({
        name: playlist.name || '',
        description: playlist.description || ''
      });
    }
  }, [playlist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal show={show} onHide={onHide} centered className="dark-modal">
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>Editar Playlist</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="bg-dark text-light">
          <Form.Group className="mb-3">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome da playlist"
              className="bg-dark text-light border-secondary"
              required
              maxLength={50}
            />
            <Form.Text className="text-secondary">
              {formData.name.length}/50 caracteres
            </Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição da playlist"
              className="bg-dark text-light border-secondary"
              rows={3}
              maxLength={200}
            />
            <Form.Text className="text-secondary">
              {formData.description.length}/200 caracteres
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={onHide}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Salvar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPlaylistModal;
