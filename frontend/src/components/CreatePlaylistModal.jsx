import { Modal, Button, Form } from 'react-bootstrap';

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    onSubmit(name);
    e.target.reset();
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
              required
              className="bg-secondary bg-opacity-25 text-white border-secondary"
            />
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
