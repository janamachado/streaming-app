import { Card } from 'react-bootstrap';

const MusicItem = ({ song, onAddToPlaylist }) => {
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="song-item bg-dark border-secondary mb-2">
      <Card.Body className="p-2 d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center flex-grow-1 min-width-0">
          <div className="me-3 p-2 bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-music-note text-dark fs-5"></i>
          </div>
          <div className="flex-grow-1 min-width-0">
            <h3 className="text-white fs-6 fw-medium text-truncate mb-1">{song.title}</h3>
            <p className="text-secondary small text-truncate mb-0">{song.artist}</p>
          </div>
        </div>
        <div className="d-flex align-items-center gap-3 ms-3">
          <span className="text-secondary small">{formatDuration(song.duration)}</span>
          <button
            onClick={() => onAddToPlaylist(song)}
            className="btn btn-outline-light btn-sm"
            title="Adicionar à playlist"
          >
            <i className="bi bi-plus-lg"></i>
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MusicItem;
