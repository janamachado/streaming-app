import React, { useState } from 'react';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';

const AddToPlaylistModal = ({ show, onHide, playlists, onSelectPlaylist, selectedSong }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  const handlePlaylistToggle = (playlistId) => {
    setSelectedPlaylists(prev => {
      if (prev.includes(playlistId)) {
        return prev.filter(id => id !== playlistId);
      }
      return [...prev, playlistId];
    });
  };

  const handleSave = () => {
    // Envia array com todos os IDs das playlists selecionadas
    onSelectPlaylist(selectedPlaylists);
  };

  // Limpa as seleções quando o modal é fechado
  const handleClose = () => {
    setSelectedPlaylists([]);
    onHide();
  };
  return (
    <Modal show={show} onHide={handleClose} centered className="dark-modal">
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>Adicionar música às playlists</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        {selectedSong && (
          <p className="mb-3">
            <strong>Música: </strong>
            <span className="text-secondary">{selectedSong.title}</span>
          </p>
        )}
        <ListGroup variant="flush">
          {playlists.map(playlist => (
            <ListGroup.Item
              key={playlist.id}
              action
              onClick={() => handlePlaylistToggle(playlist.id)}
              className={`bg-dark text-light border-secondary interactive ${selectedPlaylists.includes(playlist.id) ? 'selected-playlist' : ''}`}
            >
              {playlist.name}
              <small className="text-secondary d-block">
                {playlist.songs.length} música{playlist.songs.length !== 1 ? 's' : ''}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {playlists.length === 0 && (
          <p className="text-center text-secondary">
            Nenhuma playlist encontrada. Crie uma nova playlist primeiro.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary d-flex justify-content-between">
        <span className="text-secondary">
          {selectedPlaylists.length} playlist{selectedPlaylists.length !== 1 ? 's' : ''} selecionada{selectedPlaylists.length !== 1 ? 's' : ''}
        </span>
        <div>
          <Button variant="secondary" onClick={handleClose} className="me-2">
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave}
            disabled={selectedPlaylists.length === 0}
          >
            Adicionar
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToPlaylistModal;
