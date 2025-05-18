import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeletePlaylistModal = ({ show, onHide, onConfirm, playlist }) => {
  if (!playlist) return null;

  return (
    <Modal show={show} onHide={onHide} centered className="dark-modal">
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>Excluir Playlist</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <p>Tem certeza que deseja excluir a playlist <strong>{playlist.name}</strong>?</p>
        <p className="text-secondary small mb-0">
          Esta ação não pode ser desfeita e todas as músicas serão removidas da playlist.
        </p>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={() => {
            onConfirm(playlist.id);
            onHide();
          }}
        >
          Excluir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeletePlaylistModal;
