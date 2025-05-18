import { useState } from "react";
import { Card, Button, Badge, ListGroup } from 'react-bootstrap';

const PlaylistCard = ({ playlist, onDeletePlaylist, onRemoveSong }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Garantir que playlist.songs existe
  const songs = playlist.songs || [];

  return (
    <Card className="h-100 bg-dark text-light border-0 shadow-sm">
      <Card.Header className="d-flex justify-content-between align-items-center bg-dark-subtle border-0 py-3">
        <div>
          <h5 className="card-title mb-1 text-truncate">{playlist.name}</h5>
          <p className="text-dark small">{playlist.description}</p>
          <Badge bg="secondary" className="text-white">
            {songs.length} {songs.length === 1 ? 'música' : 'músicas'}
          </Badge>
        </div>
        <div className="d-flex gap-2">
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
            variant="outline-danger"
            size="sm"
            onClick={() => onDeletePlaylist(playlist._id)}
            className="rounded-circle p-1"
            style={{ width: '32px', height: '32px' }}
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
                  className="bg-dark border-secondary d-flex justify-content-between align-items-center py-3"
                >
                  <div className="text-truncate">
                    <p className="text-light mb-1 text-truncate">{song.title}</p>
                    <small className="text-secondary text-truncate">{song.artist}</small>
                  </div>
                  <Button
                    variant="link"
                    className="text-danger p-0 ms-2"
                    onClick={() => onRemoveSong(playlist.id, song.id)}
                    title="Remover da playlist"
                  >
                    <i className="bi bi-x-circle"></i>
                  </Button>
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
