import React, { useState, useMemo } from 'react';
import { Modal, Button, ListGroup, Form } from 'react-bootstrap';
import '../styles/PlaylistDetailsModal.css';

const formatDuration = (duration) => {
  if (!duration) return '--:--';
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const PlaylistDetailsModal = ({ 
  show, 
  onHide, 
  playlist, 
  onRemoveSong 
}) => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [key, setKey] = useState(0); // Estado para forçar re-render

  // Ordena as músicas por ordem de adição
  const orderedSongs = useMemo(() => {
    return (playlist?.playlistSongs || []).sort((a, b) => {
      if (!a.order && !b.order) return 0;
      if (!a.order) return 1;
      if (!b.order) return -1;
      return a.order - b.order;
    });
  }, [playlist?.playlistSongs]);

  const handleSongToggle = (songId) => {
    setSelectedSongs(prev => {
      if (prev.includes(songId)) {
        return prev.filter(id => id !== songId);
      }
      return [...prev, songId];
    });
  };

  return (
    <Modal 
      key={key} 
      show={show} 
      onHide={onHide} 
      centered 
      size="md"
      className="dark-modal"
    >
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <div>
          <Modal.Title>{playlist.name}</Modal.Title>
          <div className="text-secondary">
            {(playlist?.playlistSongs?.length || 0)} {playlist?.playlistSongs?.length === 1 ? 'música' : 'músicas'}
          </div>
        </div>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        {playlist.description && (
          <div className="playlist-description text-secondary mb-3">{playlist.description}</div>
        )}
        <div className="playlist-songs" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {orderedSongs.length > 0 ? (
            <ListGroup variant="flush">
              {orderedSongs.map((ps) => (
                <ListGroup.Item
                  key={ps.song.id}
                  className="bg-dark text-light border-secondary d-flex align-items-center"
                >
                  <Form.Check
                    type="checkbox"
                    className="me-3"
                    checked={selectedSongs.includes(ps.song.id)}
                    onChange={() => handleSongToggle(ps.song.id)}
                  />
                  <div className="me-3 rounded overflow-hidden" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                    <img 
                      src={ps.song.url} 
                      alt={`${ps.song.album || ps.song.title} cover`}
                      className="w-100 h-100 object-fit-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/48x48/6c757d/e9ecef?text=%3F';
                      }}
                    />
                  </div>
                  <div className="flex-grow-1" style={{ minWidth: 0 }}>
                    <div className="d-flex align-items-baseline">
                      <div className="fw-bold text-truncate" title={ps.song.title}>{ps.song.title}</div>
                      <small className="text-secondary ms-2" style={{ whiteSpace: 'nowrap' }}>• {formatDuration(ps.song.duration)}</small>
                    </div>
                    <div className="text-secondary text-truncate" title={`${ps.song.artist}${ps.song.album ? ` • ${ps.song.album}` : ''}`}>
                      {ps.song.artist}
                      {ps.song.album && (
                        <span> • {ps.song.album}</span>
                      )}
                    </div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <div className="text-center py-4">
              <p className="text-secondary mb-0">Nenhuma música adicionada</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer className="bg-dark border-secondary">
        <Button variant="secondary" onClick={onHide}>
          Fechar
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            onRemoveSong(selectedSongs);
            setSelectedSongs([]);
            setKey(prev => prev + 1); // Força re-render
          }}
          disabled={selectedSongs.length === 0}
        >
          Remover {selectedSongs.length} música{selectedSongs.length !== 1 ? 's' : ''}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlaylistDetailsModal;
