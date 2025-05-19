import { Form, Button } from 'react-bootstrap';
import SimpleSearchBar from './SimpleSearchBar';

function PlaylistSearch({ onSearch, onCreatePlaylist }) {
  const handleSearch = (query) => {
    onSearch({
      query,
      searchInSongs: document.getElementById('searchInSongs').checked
    });
  };

  return (
    <div>
      <SimpleSearchBar onSearch={handleSearch} placeholder="Buscar playlist" />
      <div className="mt-2 d-flex justify-content-between align-items-center">
        <Form.Check
          type="checkbox"
          id="searchInSongs"
          label="Buscar por músicas na playlist"
          onChange={(e) => handleSearch(document.querySelector('input[type="search"]').value)}
          className="text-secondary"
        />
        <Button
          variant="primary"
          onClick={onCreatePlaylist}
          className="rounded-pill px-3"
        >
          <i className="bi bi-plus-lg me-2"></i>
          Nova Playlist
        </Button>
      </div>
    </div>
  );
}

export default PlaylistSearch;
