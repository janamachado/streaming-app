import React from 'react';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';
import '../styles/PlaylistDetailsModal.css';

const PlaylistDetailsModal = ({ 
  show, 
  onHide, 
  playlist, 
  selectedSongs, 
  onSongSelect, 
  onDeleteSelected 
}) => {
  const handleSongToggle = (songId) => {
    onSongSelect(songId);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="dark-modal">
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>{playlist?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        {playlist?.description && (
          <div className="playlist-description text-secondary">{playlist.description}</div>
        )}
        <div className="playlist-songs" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {playlist?.songs?.length > 0 ? (
            <ListGroup variant="flush">
              {playlist.songs.map((song) => (
                <ListGroup.Item
                  key={song.id}
                  className="bg-dark text-light border-secondary d-flex align-items-center"
                >
                  <Form.Check
                    type="checkbox"
                    className="me-3"
                    checked={selectedSongs.includes(song.id)}
                    onChange={() => handleSongToggle(song.id)}
                  />
                  <div>
                    <div className="fw-bold">{song.title}</div>
                    <small className="text-secondary">{song.artist}</small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className="text-center text-secondary">Nenhuma música nesta playlist</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary">
        <span className="text-secondary me-auto">
          {selectedSongs.length} música{selectedSongs.length !== 1 ? 's' : ''} selecionada{selectedSongs.length !== 1 ? 's' : ''}
        </span>
        <Button 
          variant="danger" 
          onClick={onDeleteSelected}
          disabled={selectedSongs.length === 0}
        >
          Remover Selecionadas
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaylistDetailsModal;
