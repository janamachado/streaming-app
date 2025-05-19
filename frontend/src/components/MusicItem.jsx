import React from 'react';
import { Card, Button } from 'react-bootstrap';

const MusicItem = ({ song, onAddToPlaylist }) => {
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="song-item bg-dark border-secondary mb-2 me-2">
      <Card.Body className="p-2 pe-3 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center" style={{ minWidth: 0, maxWidth: 'calc(100% - 130px)' }}>
          <div className="me-3 rounded overflow-hidden" style={{ width: '40px', height: '40px', flexShrink: 0 }}>
            <img 
              src={song.url} 
              alt={`${song.album} cover`}
              className="w-100 h-100 object-fit-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/40x40/6c757d/e9ecef?text=🎵';
              }}
            />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="fw-bold text-white text-truncate" title={song.title}>
              {song.title.length > 20 ? `${song.title.substring(0, 20)}...` : song.title}
            </div>
            <div className="text-secondary text-truncate" title={`${song.artist}${song.album ? ` • ${song.album}` : ''}`}>
              {song.artist}
              {song.album && (
                <span className="text-truncate"> • {song.album}</span>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3" style={{ width: '120px', justifyContent: 'flex-end' }}>
          <span className="text-secondary small" style={{ width: '45px', textAlign: 'right' }}>{formatDuration(song.duration)}</span>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => onAddToPlaylist(song)}
            className="rounded-circle"
            style={{ width: '32px', height: '32px', padding: 0, flexShrink: 0 }}
          >
            <i className="bi bi-plus-lg"></i>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MusicItem;
