import { useState } from "react";
import { Card, Button, Badge, ListGroup, Form } from 'react-bootstrap';

const PlaylistCard = ({ playlist, onDeletePlaylist, onRemoveSong, onEditPlaylist }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);
 
  // Garantir que playlist.songs existe
  const songs = playlist.songs || [];

  return (
    <Card className="h-100 bg-dark text-light border-0 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-start bg-dark-subtle border-0 py-3">
        <div className="overflow-hidden" style={{ maxWidth: 'calc(100% - 120px)' }}>
          <h5 className="card-title mb-1 text-truncate" title={playlist.name}>{playlist.name}</h5>
          {playlist.description && (
            <p className="text-secondary mb-2 small text-truncate" title={playlist.description}>
              {playlist.description}
            </p>
          )}
          <Badge bg="secondary" className="text-white">
            {songs.length} {songs.length === 1 ? 'música' : 'músicas'}
          </Badge>
        </div>
        <div className="d-flex gap-2">
          {selectedSongs.length > 0 && (
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => {
                onRemoveSong(playlist.id, selectedSongs);
                setSelectedSongs([]);
              }}
              title="Remover da playlist"
            >
              <i className="bi bi-trash"></i>
              <span className="ms-1">{selectedSongs.length}</span>
            </Button>
          )}
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-circle p-1"
            style={{ width: '32px', height: '32px' }}
          >
            <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`}></i>
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => onEditPlaylist(playlist.id)}
            className="rounded-circle p-1 me-2"
            style={{ width: '32px', height: '32px' }}
            title="Editar playlist"
          >
            <i className="bi bi-pencil"></i>
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDeletePlaylist(playlist.id)}
            className="rounded-circle p-1"
            style={{ width: '32px', height: '32px' }}
            title="Excluir playlist"
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <ListGroup variant="flush">
          {isExpanded && (
            songs.length > 0 ? (
              songs.map((song) => (
                <ListGroup.Item
                  key={song.id}
                  className="bg-dark text-light border-secondary d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-2" style={{ maxWidth: '100%' }}>
                    <Form.Check
                      type="checkbox"
                      checked={selectedSongs.includes(song.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSongs([...selectedSongs, song.id]);
                        } else {
                          setSelectedSongs(selectedSongs.filter(id => id !== song.id));
                        }
                      }}
                    />
                    <div className="text-truncate">
                      <p className="mb-0 text-truncate" title={song.title}>{song.title}</p>
                      <small className="text-secondary text-truncate" title={song.artist}>{song.artist}</small>
                    </div>
                  </div>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item className="bg-dark text-light border-0 text-center py-4">
                <i className="bi bi-music-note-beamed d-block mb-2 fs-4"></i>
                Nenhuma música adicionada
              </ListGroup.Item>
            )
          )}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default PlaylistCard;
