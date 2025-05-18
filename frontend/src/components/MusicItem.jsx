import { PlusCircleIcon } from "@heroicons/react/24/outline";

const MusicItem = ({ song, onAddToPlaylist }) => {
  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="song-item p-3 d-flex justify-content-between align-items-center">
      <div className="flex-grow-1 min-width-0">
        <h3 className="text-white fs-6 fw-medium text-truncate mb-1">{song.title}</h3>
        <p className="text-secondary small text-truncate mb-0">{song.artist}</p>
      </div>
      <div className="d-flex align-items-center gap-3 ms-3">
        <span className="text-secondary small">{formatDuration(song.duration)}</span>
        <button
          onClick={() => onAddToPlaylist(song)}
          className="btn btn-link text-secondary p-0 border-0"
          title="Adicionar à playlist"
        >
          <PlusCircleIcon className="icon" style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
      </div>
    </div>
  );
};

export default MusicItem;
