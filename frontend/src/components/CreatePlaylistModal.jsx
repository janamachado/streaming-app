import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData.name);
    setFormData({ name: '', description: '' });
    onClose();
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      className="text-light"
      contentClassName="bg-dark"
    >
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title>Nova Playlist</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label className="text-secondary">Nome da playlist</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nome da playlist"
              className="bg-dark text-light border-secondary"
              required
              maxLength={25}
            />
            <Form.Text className="text-secondary">
              {formData.name.length}/25 caracteres
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Criar
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePlaylistModal;
