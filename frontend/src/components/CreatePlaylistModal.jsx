import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreatePlaylistModal = ({ show, onHide, onCreatePlaylist }) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onCreatePlaylist(formData);
    if (success) {
      setFormData({ name: '', description: '' });
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="dark-modal"
    >
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>Nova Playlist</Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark text-light">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Label>Nome da playlist</Form.Label>
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

          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Descrição <span className="text-secondary">(opcional)</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Adicione uma descrição para sua playlist"
              className="bg-dark text-light border-secondary"
              maxLength={200}
            />
            <Form.Text className="text-secondary">
              {formData.description.length}/200 caracteres
            </Form.Text>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
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
