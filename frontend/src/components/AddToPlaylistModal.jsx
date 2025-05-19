import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';

const AddToPlaylistModal = ({ show, onHide, playlists, onSelectPlaylist, selectedSong, onCreatePlaylist }) => {
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);

  // Limpa seleção quando as playlists mudam
  useEffect(() => {
    setSelectedPlaylists([]);
  }, [playlists]);

  // Limpa seleção quando o modal fecha
  useEffect(() => {
    if (!show) {
      setSelectedPlaylists([]);
    }
  }, [show]);

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
    <Modal show={show} onHide={handleClose} centered className="dark-modal" dialogClassName="modal-fixed-height">
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <div className="d-flex flex-column">
          <Modal.Title>
            {selectedSong ? (
              <>Adicionar <strong>{selectedSong.title}</strong> em:</>
            ) : (
              'Adicionar música às playlists'
            )}
          </Modal.Title>
          {selectedSong && (
            <div className="text-secondary mt-1 d-flex align-items-center gap-3">
              <span><strong>Artista:</strong> {selectedSong.artist}</span>
              <span className="text-primary">•</span>
              <span>{selectedPlaylists.length} playlist{selectedPlaylists.length !== 1 ? 's' : ''} selecionada{selectedPlaylists.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light p-0" style={{ height: '60vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <ListGroup variant="flush">
            {playlists.map(playlist => (
              <ListGroup.Item
                key={playlist.id}
                className="bg-dark text-light border-secondary"
              >
                <div className="px-3 py-2 d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    id={`playlist-${playlist.id}`}
                    checked={selectedPlaylists.includes(playlist.id)}
                    onChange={() => handlePlaylistToggle(playlist.id)}
                    label={
                      <div className="ms-2">
                        <div>{playlist.name}</div>
                        <small className="text-secondary">
                          {(playlist.playlistSongs || []).length} música{(playlist.playlistSongs || []).length !== 1 ? 's' : ''}
                        </small>
                      </div>
                    }
                    className="text-light m-0"
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
          {playlists.length === 0 && (
            <div className="p-3 text-center">
              <p className="text-secondary mb-3">Nenhuma playlist encontrada.</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary d-flex justify-content-between align-items-center">
        <Button
          variant="link"
          onClick={() => {
            handleClose();
            onCreatePlaylist();
          }}
          className="text-primary text-decoration-none p-0"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Criar Nova Playlist
        </Button>
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
